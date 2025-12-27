// web/app/(dashboard)/dashboard/page.tsx
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { OnboardingTour } from '@/components/tutorial/onboarding-tour';
import { CreateBoardButton } from '@/components/dashboard/create-board-button';
import { JoinBoardButton } from '@/components/dashboard/join-board-button';
import { LogoutButton } from '@/components/dashboard/logout-button';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { StatsOverview } from '@/components/dashboard/stats-overview';
import { BoardCard } from '@/components/dashboard/board-card';
import { Lock, Users, Calendar, ArrowRight, Sparkles, Clock } from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  // Ambil data user beserta:
  // 1. boards: Board yang dimiliki user
  // 2. memberships: Board di mana user adalah member (join via invite)
  const user = await db.user.findUnique({
    where: { email: session.user.email! },
    include: {
      boards: {
        orderBy: { updatedAt: 'desc' },
      },
      memberships: {
        include: {
          board: true,
        },
      },
    },
  });

  if (!user) redirect('/login');

  const showTutorial = user?.tutorialCompleted === false;
  const ownedBoards = user?.boards || [];
  const joinedBoards = user?.memberships?.map((m) => m.board) || [];
  const hasAnyBoard = ownedBoards.length > 0 || joinedBoards.length > 0;

  // Prepare recent boards for quick access
  const recentBoards = [...ownedBoards, ...joinedBoards].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);

  // Get current time greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Selamat Pagi' : hour < 18 ? 'Selamat Siang' : 'Selamat Malam';

  // Calculate Real Stats
  const allBoardIds = [...ownedBoards.map((b) => b.id), ...joinedBoards.map((b) => b.id)];

  const [completedTasksCount, pendingInProgressCount, uniqueCollaboratorsCount] = await Promise.all([
    // Count 'DONE' tasks in all visible boards
    db.card.count({
      where: {
        list: { boardId: { in: allBoardIds } },
        status: 'DONE',
      },
    }),
    // Count 'TODO' or 'IN_PROGRESS' tasks
    db.card.count({
      where: {
        list: { boardId: { in: allBoardIds } },
        status: { not: 'DONE' },
      },
    }),
    // Count unique collaborators (excluding self)
    db.boardMember
      .findMany({
        where: {
          boardId: { in: allBoardIds },
          userId: { not: user.id },
        },
        distinct: ['userId'],
        select: {
          userId: true,
        },
      })
      .then((members) => members.length),
  ]);

  return (
    <div className="gradient-bg grid-pattern min-h-screen p-4 sm:p-8">
      {/* Floating Orbs */}
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />
      <div className="floating-orb orb-3" />

      <OnboardingTour showTutorial={showTutorial} />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Enhanced Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-700/50 pb-6 mb-8">
          <div id="welcome-header" className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-zinc-500 mb-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {greeting}, <span className="gradient-text-primary">{session.user.name?.split(' ')[0]}</span>! 👋
            </h1>
            <p className="text-zinc-400 mt-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              Apa yang ingin kamu selesaikan hari ini?
            </p>
          </div>
          <LogoutButton />
        </header>

        {/* Stats Overview - Only show when there are boards */}
        {hasAnyBoard && <StatsOverview totalBoards={ownedBoards.length + joinedBoards.length} completedTasks={completedTasksCount} pendingTasks={pendingInProgressCount} collaborators={uniqueCollaboratorsCount} />}

        {/* Quick Actions Bar */}
        {hasAnyBoard && <QuickActions recentBoards={recentBoards.map((b) => ({ id: b.id, title: b.title, updatedAt: b.updatedAt }))} />}

        <main>
          {!hasAnyBoard ? (
            // Empty State - Enhanced
            <div className="glass-card rounded-2xl border border-dashed border-zinc-600/50 p-8 sm:p-16 text-center relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-2xl" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-emerald-500/10 to-transparent rounded-full blur-2xl" />

              <div className="relative">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-6">
                  <svg className="h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                    />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-zinc-100 mb-2">Belum Ada Board</h3>
                <p className="text-zinc-400 max-w-md mx-auto mb-8">Mulai perjalanan produktivitasmu! Buat board baru untuk mengatur tugas atau gabung ke board teman untuk berkolaborasi.</p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <CreateBoardButton />
                  <JoinBoardButton />
                </div>

                {/* Tips section */}
                <div className="mt-10 pt-8 border-t border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-4">💡 Tips Cepat</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {['Atur tugas dengan list', 'Undang tim untuk kolaborasi', 'Track progress real-time'].map((tip, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-xs text-zinc-400">
                        {tip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Boards Grid - Enhanced
            <div className="space-y-8">
              {/* Section: Board Milik Sendiri */}
              {ownedBoards.length > 0 && (
                <section>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <Lock className="h-4 w-4 text-indigo-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-zinc-200">Board Saya</h2>
                        <p className="text-xs text-zinc-500">{ownedBoards.length} board</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <CreateBoardButton />
                      <JoinBoardButton />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ownedBoards.map((board, index) => (
                      <BoardCard key={board.id} board={board} index={index} isOwner={true} />
                    ))}
                  </div>
                </section>
              )}

              {/* Section: Board yang di-join */}
              {joinedBoards.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <Users className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-zinc-200">Board yang Diikuti</h2>
                      <p className="text-xs text-zinc-500">{joinedBoards.length} board kolaborasi</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {joinedBoards.map((board, index) => (
                      <BoardCard key={board.id} board={board} index={index} isOwner={false} />
                    ))}
                  </div>
                </section>
              )}

              {/* Tombol tambahan jika hanya punya joined boards */}
              {ownedBoards.length === 0 && (
                <div className="text-center pt-4 glass-card rounded-xl p-8">
                  <Sparkles className="h-8 w-8 text-indigo-400 mx-auto mb-3" />
                  <p className="text-sm text-zinc-400 mb-4">Ingin membuat board sendiri?</p>
                  <CreateBoardButton />
                </div>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-zinc-800 text-center">
          <p className="text-xs text-zinc-600">Flerro • Kelola tugas dengan lebih efisien</p>
        </footer>
      </div>
    </div>
  );
}
