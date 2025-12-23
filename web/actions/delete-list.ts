// web/actions/delete-list.ts
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteList(listId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: 'Unauthorized' };
  }

  try {
    const list = await db.list.findUnique({
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
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (list.board.userId !== user?.id) {
      // Check if user is a member
      const membership = await db.boardMember.findUnique({
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
    await db.list.delete({
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
