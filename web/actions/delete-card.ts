// web/actions/delete-card.ts
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteCard(cardId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: 'Unauthorized' };
  }

  try {
    const card = await db.card.findUnique({
      where: { id: cardId },
      include: { list: { include: { board: true } } },
    });

    if (!card) {
      return { error: 'Card tidak ditemukan' };
    }

    const boardId = card.list.boardId;

    await db.card.delete({
      where: { id: cardId },
    });

    revalidatePath(`/dashboard/board/${boardId}`);

    return { success: true };
  } catch (error) {
    console.error('Error deleting card:', error);
    return { error: 'Gagal menghapus card' };
  }
}
