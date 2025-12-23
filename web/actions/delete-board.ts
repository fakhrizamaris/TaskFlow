// web/actions/delete-board.ts
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteBoard(boardId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: 'Unauthorized' };
  }

  try {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { error: 'User tidak ditemukan' };
    }

    const board = await db.board.findUnique({
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
    await db.board.delete({
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
