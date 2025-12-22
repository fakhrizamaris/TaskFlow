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
  const board = await db.board.findFirst({
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

  if (!board) redirect('/dashboard');

  return (
    <div className="relative h-full bg-blue-500 min-h-screen overflow-hidden">
      {/* 1. Pasang Navbar di sini */}
      <BoardNavbar data={board} />

      {/* 2. Konten List Container */}
      {/* Tambahkan pt-20 agar tidak ketutup navbar */}
      <main className="h-full overflow-x-auto p-4 pt-20">
        <ListContainer boardId={boardId} data={board.lists} />
      </main>
    </div>
  );
}
