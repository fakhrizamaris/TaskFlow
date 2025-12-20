// web/app/(dashboard)/dashboard/page.tsx
import { auth, signOut } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Halo, {session?.user?.name}! 👋</p>
          </div>

          <form
            action={async () => {
              'use server';
              await signOut();
            }}
          >
            <button className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition">Logout</button>
          </form>
        </header>

        {/* Area Konten Utama */}
        <main className="mt-8">
          <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">Belum ada board</h3>
            <p className="mt-1 text-sm text-gray-500">Mulai dengan membuat board baru.</p>
            <div className="mt-6">
              {/* ID ini nanti penting buat Tutorial Driver.js */}
              <button
                id="create-board-btn"
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                + Buat Board Baru
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
