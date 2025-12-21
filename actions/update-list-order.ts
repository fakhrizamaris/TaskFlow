// web/actions/update-list-order.ts
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

interface ListUpdate {
  id: string;
  order: number;
  boardId: string;
}

export async function updateListOrder(items: ListUpdate[]) {
  const session = await auth();

  if (!session?.user || items.length === 0) {
    return { error: 'Unauthorized' };
  }

  const boardId = items[0].boardId;

  // Verifikasi kepemilikan board
  const board = await db.board.findUnique({
    where: {
      id: boardId,
      userId: session.user.id,
    },
  });

  if (!board) {
    return { error: 'Board tidak ditemukan' };
  }

  const transaction = items.map((list) =>
    db.list.update({
      where: {
        id: list.id,
        boardId: boardId, // Pastikan list milik board yang benar
      },
      data: {
        order: list.order,
      },
    })
  );

  try {
    await db.$transaction(transaction);
    revalidatePath(`/dashboard/board/${boardId}`);
    return { success: true };
  } catch (error) {
    return { error: 'Gagal menyimpan urutan list' };
  }
}
