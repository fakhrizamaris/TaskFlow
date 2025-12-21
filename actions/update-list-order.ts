// web/actions/update-list-order.ts
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateListOrder(items: { id: string; order: number; boardId: string }[]) {
  const session = await auth();

  if (!session?.user || items.length === 0) return { error: 'Unauthorized' };

  const boardId = items[0].boardId;

  // Gunakan Transaction agar semua update terjadi bersamaan (Atomic)
  const transaction = items.map((list) =>
    db.list.update({
      where: {
        id: list.id,
        // Pastikan board milik user (Security)
        board: { userId: session.user.id },
      },
      data: { order: list.order },
    })
  );

  try {
    await db.$transaction(transaction);
    revalidatePath(`/board/${boardId}`);
    return { success: true };
  } catch (error) {
    return { error: 'Gagal menyimpan urutan' };
  }
}
