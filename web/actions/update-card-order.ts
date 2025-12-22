// web/actions/update-card-order.ts
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

interface CardUpdate {
  id: string;
  order: number;
  listId: string;
  boardId: string;
}

export async function updateCardOrder(items: CardUpdate[]) {
  const session = await auth();

  if (!session?.user?.id || items.length === 0) return { error: 'Unauthorized' };

  const boardId = items[0].boardId;

  const transaction = items.map((card) =>
    db.card.update({
      where: {
        id: card.id,
        list: { board: { userId: session.user!.id } },
      },
      data: {
        order: card.order,
        listId: card.listId, // Update listId juga (jika pindah kolom)
      },
    })
  );

  try {
    await db.$transaction(transaction);
    revalidatePath(`/dashboard/board/${boardId}`);
    return { success: true };
  } catch {
    return { error: 'Gagal menyimpan urutan kartu' };
  }
}
