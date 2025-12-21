// web/app/(dashboard)/board/[boardId]/page.tsx
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { ListContainer } from './_components/list-container'; // Kita buat sebentar lagi

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
  const board = await db.board.findUnique({
    where: {
      id: boardId,
      userId: session.user.id, // Pastikan hanya pemilik yang bisa akses
    },
    include: {
      lists: {
        orderBy: { order: 'asc' }, // Urutkan list dari kiri ke kanan
        include: {
          cards: {
            orderBy: { order: 'asc' }, // Urutkan kartu dari atas ke bawah
          },
        },
      },
    },
  });

  // Jika board tidak ketemu (atau bukan miliknya), tendang ke dashboard
  if (!board) redirect('/dashboard');

  return (
    <div className="p-4 h-full overflow-x-auto bg-blue-500 min-h-screen text-white">
      {/* Header Board Sederhana */}
      <div className="font-bold text-xl mb-4 px-2">{board.title}</div>

      {/* Kontainer List (Tempat kita menaruh kolom-kolom) */}
      <ListContainer boardId={boardId} data={board.lists} />
    </div>
  );
}
