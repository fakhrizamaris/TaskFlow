// actions/update-card-status.ts
'use server';

import { defaultDeps, type Dependencies } from '@/lib/deps';
import { revalidatePath } from 'next/cache';

// Define CardStatus type locally until Prisma regenerates
type CardStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

// Internal function yang bisa di-test
export async function _updateCardStatus(cardId: string, status: CardStatus, deps: Dependencies = defaultDeps) {
  const session = await deps.auth();
  if (!session?.user?.email) {
    return { error: 'Unauthorized' };
  }

  try {
    const card = await deps.db.card.findUnique({
      where: { id: cardId },
      include: { list: { include: { board: true } } },
    });

    if (!card) {
      return { error: 'Card tidak ditemukan' };
    }

    await deps.db.card.update({
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

// Server action wrapper
export async function updateCardStatus(cardId: string, status: CardStatus) {
  return _updateCardStatus(cardId, status);
}
