// web/app/(dashboard)/dashboard/page.tsx
import { auth, signOut } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { OnboardingTour } from '@/components/tutorial/onboarding-tour';
import { CreateBoardButton } from '@/components/dashboard/create-board-button'; // Import Komponen Baru

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const user = await db.user.findUnique({
    where: { email: session.user.email! },
    include: { boards: true }, // KITA AMBIL DATA BOARD SEKALIAN
  });

  const showTutorial = user?.tutorialCompleted === false;
  const hasBoards = user?.boards && user.boards.length > 0; // Cek apakah sudah punya board

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <OnboardingTour showTutorial={showTutorial} />

      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b pb-6 mb-8">
          <div id="welcome-header">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
            <p className="text-gray-500 mt-1">Halo, {session.user.name}!</p>
          </div>
          {/* ... tombol logout biarkan saja ... */}
        </header>

        <main>
          {!hasBoards ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-16 text-center shadow-sm">
              {/* ... ikon svg biarkan saja ... */}
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Belum ada Board</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto mb-8">Buat board baru untuk mulai mengatur tugas.</p>

              {/* Panggil Komponen Disini */}
              <CreateBoardButton />
            </div>
          ) : (
            // KONDISI: Jika SUDAH Punya Board -> Tampilkan Grid List
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Project Saya</h2>
                {/* Tombol create kecil di pojok jika sudah punya board */}
                <CreateBoardButton />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {user.boards.map((board) => (
                  <Link key={board.id} href={`/dashboard/board/${board.id}`}>
                    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer group">
                      <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition">{board.title}</h3>
                      <p className="text-xs text-gray-400 mt-2">Dibuat: {board.createdAt.toLocaleDateString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
