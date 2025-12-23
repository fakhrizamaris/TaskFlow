// web/app/api/cron/deadline-reminder/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { getDeadlineReminderTemplate, getDeadlineReminderText } from '@/lib/email-templates';

// Type for card with dueDate (extend until Prisma types are regenerated)
interface CardWithRelations {
  id: string;
  title: string;
  dueDate: Date | null;
  status: string;
  list: {
    title: string;
    board: {
      title: string;
      user: {
        id: string;
        name: string | null;
        email: string;
      };
    };
  };
  author: {
    id: string;
    name: string | null;
    email: string;
  };
}

// This endpoint should be called by a cron job (e.g., Vercel Cron, GitHub Actions, or external service)
// Recommended: Run every hour

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();

    // Find cards with deadlines in the next 24 hours or overdue (max 3 days overdue)
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Get cards with approaching or overdue deadlines
    // Using 'as any' for the where clause until Prisma types are fully regenerated
    const upcomingCards = (await db.card.findMany({
      where: {
        dueDate: {
          gte: threeDaysAgo,
          lte: oneDayFromNow,
        },
        status: {
          not: 'DONE' as const, // Don't remind for completed tasks
        },
      } as any,
      include: {
        list: {
          include: {
            board: {
              include: {
                user: true,
              },
            },
          },
        },
        author: true,
      },
    })) as unknown as CardWithRelations[];

    if (upcomingCards.length === 0) {
      return NextResponse.json({
        message: 'No upcoming deadlines to notify',
        checked: now.toISOString(),
      });
    }

    // Group cards by user (board owner)
    const userTasksMap = new Map<
      string,
      {
        user: { id: string; name: string | null; email: string };
        tasks: CardWithRelations[];
      }
    >();

    for (const card of upcomingCards) {
      const boardOwner = card.list.board.user;

      if (!userTasksMap.has(boardOwner.id)) {
        userTasksMap.set(boardOwner.id, {
          user: {
            id: boardOwner.id,
            name: boardOwner.name,
            email: boardOwner.email,
          },
          tasks: [],
        });
      }

      userTasksMap.get(boardOwner.id)!.tasks.push(card);
    }

    // Send emails to each user
    const emailResults: { email: string; success: boolean; taskCount: number }[] = [];

    for (const [, userData] of userTasksMap) {
      const { user, tasks } = userData;

      // Format tasks for email template
      const formattedTasks = tasks.map((task) => {
        const dueDate = new Date(task.dueDate!);
        const diffMs = dueDate.getTime() - now.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        let timeRemaining: string;
        const isOverdue = diffMs < 0;

        if (isOverdue) {
          const overdueDays = Math.abs(diffDays);
          const overdueHours = Math.abs(diffHours) % 24;
          const overdueMinutes = Math.abs(Math.floor(diffMs / (1000 * 60))) % 60;
          if (overdueDays > 0) {
            timeRemaining = `Terlambat ${overdueDays} Hari ${overdueHours} Jam`;
          } else if (overdueHours > 0) {
            timeRemaining = `Terlambat ${overdueHours} Jam ${overdueMinutes} Menit`;
          } else {
            timeRemaining = `Terlambat ${overdueMinutes} Menit`;
          }
        } else {
          const totalMinutes = Math.floor(diffMs / (1000 * 60));
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;

          if (diffDays >= 1) {
            const remainingHours = hours % 24;
            timeRemaining = `${diffDays} Hari ${remainingHours} Jam`;
          } else if (hours > 0) {
            timeRemaining = `${hours} Jam ${minutes} Menit`;
          } else {
            timeRemaining = `${minutes} Menit`;
          }
        }

        return {
          cardTitle: task.title,
          listTitle: task.list.title,
          boardTitle: task.list.board.title,
          dueDate,
          timeRemaining,
          isOverdue,
        };
      });

      // Sort: overdue first, then by deadline
      formattedTasks.sort((a, b) => {
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      });

      // Send email
      const result = await sendEmail({
        to: user.email,
        subject: formattedTasks.some((t) => t.isOverdue) ? '⚠️ Ada Task Terlambat! - Flerro' : '⏰ Deadline Reminder - Flerro',
        html: getDeadlineReminderTemplate(user.name || 'User', formattedTasks),
        text: getDeadlineReminderText(user.name || 'User', formattedTasks),
      });

      emailResults.push({
        email: user.email,
        success: result.success,
        taskCount: tasks.length,
      });
    }

    return NextResponse.json({
      message: 'Deadline reminders processed',
      timestamp: now.toISOString(),
      totalCards: upcomingCards.length,
      usersNotified: emailResults.length,
      results: emailResults,
    });
  } catch (error) {
    console.error('Deadline reminder cron error:', error);
    return NextResponse.json({ error: 'Failed to process deadline reminders' }, { status: 500 });
  }
}

// Also support POST for flexibility
export async function POST(request: NextRequest) {
  return GET(request);
}
