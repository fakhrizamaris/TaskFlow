import Link from 'next/link';
import { auth } from '@/lib/auth';
import { ArrowRight, Layout, Users, Zap } from 'lucide-react';

export default async function LandingPage() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navbar */}
      <header className="fixed top-0 w-full border-b bg-white/80 backdrop-blur-md z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <img src="/icon123.png" alt="Flerro Logo" className="h-8 w-8" />
            <span>Flerro</span>
          </div>

          <div className="flex items-center gap-4">
            {session?.user ? (
              <Link href="/dashboard" className="rounded-full bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
                Ke Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-black">
                  Login
                </Link>
                <Link
                  href="/login" // Arahkan ke login juga untuk demo
                  className="rounded-full bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 transition"
                >
                  Daftar Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-6 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6">
              Kolaborasi Project jadi lebih <span className="text-blue-600">Mudah & Cepat</span>
            </h1>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">Atur tugas tim, pantau progres, dan selesaikan project tepat waktu dengan Flerro. Satu platform untuk semua kebutuhan manajemen tugasmu.</p>

            <div className="flex justify-center gap-4">
              <Link
                href={session?.user ? '/dashboard' : '/login'}
                className="flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-blue-500 hover:shadow-xl transition transform hover:-translate-y-1"
              >
                Mulai Sekarang <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3 text-left">
            <div className="rounded-2xl bg-gray-50 p-8 hover:bg-gray-100 transition">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Layout className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Kanban Board</h3>
              <p className="mt-2 text-gray-600">Visualisasikan alur kerja dengan papan interaktif yang intuitif.</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-8 hover:bg-gray-100 transition">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Kolaborasi Tim</h3>
              <p className="mt-2 text-gray-600">Undang teman dan kerjakan tugas bersama secara realtime.</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-8 hover:bg-gray-100 transition">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Realtime Update</h3>
              <p className="mt-2 text-gray-600">Lihat perubahan seketika tanpa perlu refresh halaman.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-gray-500">&copy; 2025 TaskFlow. Dibuat oleh fdjmrs.</footer>
    </div>
  );
}
