// web/app/(dashboard)/dashboard/board/[boardId]/layout.tsx
import { BoardSocketProvider } from '@/providers/board-socket-provider';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

interface BoardLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    boardId: string;
  }>;
}

export default async function BoardLayout({ children, params }: BoardLayoutProps) {
  const { boardId } = await params;

  const session = await auth();
  if (!session?.user) redirect('/login');

  const currentUser = {
    id: session.user.id || '',
    name: session.user.name || 'Unknown',
    image: session.user.image || undefined,
  };

  return (
    <BoardSocketProvider boardId={boardId} currentUser={currentUser}>
      {children}
    </BoardSocketProvider>
  );
}
