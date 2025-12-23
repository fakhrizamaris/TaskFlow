// web/app/(dashboard)/board/[boardId]/page.tsx
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { ListContainer } from './_components/list-container';
import { BoardNavbar } from './_components/board-navbar';

interface BoardIdPageProps {
  params: Promise<{
    boardId: string;
  }>;
}

export default async function BoardIdPage({ params }: BoardIdPageProps) {
  const { boardId } = await params; // Next.js 15: params is now a Promise

  const session = await auth();
  if (!session?.user) redirect('/login');

  // Ambil data board beserta List dan Card di dalamnya
  let board;
  try {
    board = await db.board.findFirst({
      // Ubah findUnique jadi findFirst
      where: {
        id: boardId,
        // LOGIKA BARU:
        // Boleh masuk JIKA: Dia pemilik (userId) ATAU dia ada di daftar members
        OR: [{ userId: session.user.id }, { members: { some: { userId: session.user.id } } }],
      },
      include: {
        lists: {
          orderBy: { order: 'asc' },
          include: {
            cards: { orderBy: { order: 'asc' } },
          },
        },
      },
    });
  } catch (error) {
    console.error('Error fetching board:', error);
    // If there's a database error (likely schema mismatch), redirect to dashboard
    redirect('/dashboard');
  }

  if (!board) redirect('/dashboard');

  return (
    <div className="gradient-bg grid-pattern relative h-full min-h-screen overflow-hidden">
      {/* Floating Orbs */}
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />
      <div className="floating-orb orb-3" />

      {/* 1. Pasang Navbar di sini */}
      <BoardNavbar data={board} />

      {/* 2. Konten List Container */}
      {/* Tambahkan pt-20 agar tidak ketutup navbar */}
      <main className="relative z-10 h-full overflow-x-auto p-4 pt-20">
        <ListContainer boardId={boardId} data={board.lists} />
      </main>
    </div>
  );
}
