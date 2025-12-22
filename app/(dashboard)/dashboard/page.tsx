// web/app/(dashboard)/dashboard/page.tsx
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { OnboardingTour } from '@/components/tutorial/onboarding-tour';
import { CreateBoardButton } from '@/components/dashboard/create-board-button';
import { JoinBoardButton } from '@/components/dashboard/join-board-button';
import { LogoutButton } from '@/components/dashboard/logout-button';
import { Lock, Users } from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  // Ambil data user beserta:
  // 1. boards: Board yang dimiliki user
  // 2. memberships: Board di mana user adalah member (join via invite)
  const user = await db.user.findUnique({
    where: { email: session.user.email! },
    include: {
      boards: true,
      memberships: {
        include: {
          board: true, // Ambil data board-nya juga
        },
      },
    },
  });

  const showTutorial = user?.tutorialCompleted === false;
  const ownedBoards = user?.boards || [];
  const joinedBoards = user?.memberships?.map((m) => m.board) || [];
  const hasAnyBoard = ownedBoards.length > 0 || joinedBoards.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <OnboardingTour showTutorial={showTutorial} />

      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b pb-6 mb-8">
          <div id="welcome-header">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-gray-500 mt-1">Halo, {session.user.name}!</p>
          </div>
          {/* Tombol Logout */}
          <LogoutButton />
        </header>

        <main>
          {!hasAnyBoard ? (
            // Kondisi: Belum punya board sama sekali
            <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-16 text-center shadow-sm">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Belum ada Board</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto mb-8">Buat board baru atau gabung ke board teman!</p>

              <div className="flex justify-center gap-3 flex-wrap">
                <CreateBoardButton />
                <JoinBoardButton />
              </div>
            </div>
          ) : (
            // Kondisi: Sudah punya board
            <div className="space-y-8">
              {/* Section: Board Milik Sendiri */}
              {ownedBoards.length > 0 && (
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Board Saya</h2>
                    <div className="flex gap-2">
                      <CreateBoardButton />
                      <JoinBoardButton />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {ownedBoards.map((board) => (
                      <Link key={board.id} href={`/dashboard/board/${board.id}`}>
                        <div className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer group relative">
                          {/* Badge tipe board */}
                          <div className="absolute top-3 right-3">
                            {board.inviteCode ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                <Users className="h-3 w-3" />
                                Kolaborasi
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                <Lock className="h-3 w-3" />
                                Pribadi
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition pr-20">{board.title}</h3>
                          <p className="text-xs text-gray-400 mt-2">Dibuat: {board.createdAt.toLocaleDateString('id-ID')}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Section: Board yang di-join */}
              {joinedBoards.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Board yang Diikuti</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {joinedBoards.map((board) => (
                      <Link key={board.id} href={`/dashboard/board/${board.id}`}>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl shadow-sm border border-green-200 hover:shadow-md transition cursor-pointer group">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-green-600" />
                            <span className="text-xs font-medium text-green-600">Kolaborasi</span>
                          </div>
                          <h3 className="font-bold text-lg text-gray-800 group-hover:text-green-600 transition">{board.title}</h3>
                          <p className="text-xs text-gray-400 mt-2">Bergabung sejak: {board.createdAt.toLocaleDateString('id-ID')}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Tombol tambahan jika hanya punya joined boards */}
              {ownedBoards.length === 0 && (
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500 mb-3">Ingin membuat board sendiri?</p>
                  <CreateBoardButton />
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
