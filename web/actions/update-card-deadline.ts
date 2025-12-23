// web/actions/update-card-deadline.ts
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateCardDeadline(cardId: string, dueDate: string | null) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: 'Unauthorized' };
  }

  try {
    // First, get the card to find the board ID
    const card = await db.card.findUnique({
      where: { id: cardId },
      include: { list: { include: { board: true } } },
    });

    if (!card) {
      return { error: 'Card tidak ditemukan' };
    }

    const boardId = card.list.boardId;

    // Convert dueDate string to proper Date object
    let parsedDate: Date | null = null;
    if (dueDate) {
      // Handle ISO format (e.g., "2025-12-30T17:00:00.000Z" or "2025-12-30T17:00")
      parsedDate = new Date(dueDate);

      // Validate the date
      if (isNaN(parsedDate.getTime())) {
        console.error('Invalid date format received:', dueDate);
        return { error: 'Format tanggal tidak valid' };
      }

      console.log('Parsed date:', parsedDate.toISOString(), 'from input:', dueDate);
    }

    // Update using Prisma (using 'as any' while IDE reloads Prisma types)
    await db.card.update({
      where: { id: cardId },
      data: {
        dueDate: parsedDate,
      } as any,
    });

    revalidatePath(`/dashboard/board/${boardId}`);

    return { success: true, dueDate: parsedDate?.toISOString() || null };
  } catch (error) {
    console.error('Error updating card deadline:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('column') || errorMessage.includes('dueDate') || errorMessage.includes('does not exist')) {
      return { error: 'Kolom dueDate belum ada. Jalankan: npx prisma db push' };
    }

    return { error: `Gagal mengupdate deadline: ${errorMessage}` };
  }
}
