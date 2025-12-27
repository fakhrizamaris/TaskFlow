// actions/delete-list.ts
'use server';

import { defaultDeps, type Dependencies } from '@/lib/deps';
import { revalidatePath } from 'next/cache';

// Internal function yang bisa di-test
export async function _deleteList(listId: string, deps: Dependencies = defaultDeps) {
  const session = await deps.auth();
  if (!session?.user?.email) {
    return { error: 'Unauthorized' };
  }

  try {
    const list = await deps.db.list.findUnique({
      where: { id: listId },
      include: {
        board: true,
        cards: true,
      },
    });

    if (!list) {
      return { error: 'List tidak ditemukan' };
    }

    // Check if user owns the board
    const user = await deps.db.user.findUnique({
      where: { email: session.user.email },
    });

    if (list.board.userId !== user?.id) {
      // Check if user is a member
      const membership = await deps.db.boardMember.findUnique({
        where: {
          boardId_userId: {
            boardId: list.board.id,
            userId: user?.id || '',
          },
        },
      });

      if (!membership || membership.role !== 'admin') {
        return { error: 'Anda tidak memiliki izin untuk menghapus list ini' };
      }
    }

    const boardId = list.boardId;
    const cardCount = list.cards.length;

    // Delete the list (cards will be cascade deleted)
    await deps.db.list.delete({
      where: { id: listId },
    });

    revalidatePath(`/dashboard/board/${boardId}`);

    return {
      success: true,
      message: `List "${list.title}" dan ${cardCount} card berhasil dihapus`,
    };
  } catch (error) {
    console.error('Error deleting list:', error);
    return { error: 'Gagal menghapus list' };
  }
}

// Server action wrapper
export async function deleteList(listId: string) {
  return _deleteList(listId);
}
