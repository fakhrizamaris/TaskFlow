// actions/delete-board.ts
'use server';

import { defaultDeps, type Dependencies } from '@/lib/deps';
import { revalidatePath } from 'next/cache';

// Internal function yang bisa di-test
export async function _deleteBoard(boardId: string, deps: Dependencies = defaultDeps) {
  const session = await deps.auth();
  if (!session?.user?.email) {
    return { error: 'Unauthorized' };
  }

  try {
    const user = await deps.db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { error: 'User tidak ditemukan' };
    }

    const board = await deps.db.board.findUnique({
      where: { id: boardId },
      include: {
        lists: {
          include: {
            cards: true,
          },
        },
        members: true,
      },
    });

    if (!board) {
      return { error: 'Board tidak ditemukan' };
    }

    // Only board owner can delete the board
    if (board.userId !== user.id) {
      return { error: 'Hanya pemilik board yang dapat menghapus board ini' };
    }

    // Count totals for confirmation message
    const listCount = board.lists.length;
    const cardCount = board.lists.reduce((acc, list) => acc + list.cards.length, 0);
    const memberCount = board.members.length;

    // Delete the board (lists, cards, and members will be cascade deleted)
    await deps.db.board.delete({
      where: { id: boardId },
    });

    revalidatePath('/dashboard');

    return {
      success: true,
      message: `Board "${board.title}" berhasil dihapus`,
      stats: { listCount, cardCount, memberCount },
      shouldRedirect: true,
    };
  } catch (error) {
    console.error('Error deleting board:', error);
    return { error: 'Gagal menghapus board' };
  }
}

// Server action wrapper
export async function deleteBoard(boardId: string) {
  return _deleteBoard(boardId);
}
