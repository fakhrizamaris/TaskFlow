// web/actions/update-card-status.ts
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Define CardStatus type locally until Prisma regenerates
type CardStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export async function updateCardStatus(cardId: string, status: CardStatus) {
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

    await db.card.update({
      where: { id: cardId },
      data: { status } as any, // Type assertion until Prisma regenerates
    });

    revalidatePath(`/dashboard/board/${card.list.boardId}`);

    return { success: true, status };
  } catch (error) {
    console.error('Error updating card status:', error);
    return { error: 'Gagal mengupdate status' };
  }
}
