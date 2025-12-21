// web/actions/create-list.ts
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createList(formData: FormData) {
  const session = await auth();
  const boardId = formData.get('boardId') as string;
  const title = formData.get('title') as string;

  if (!session?.user || !boardId || !title) return { error: 'Data tidak lengkap' };

  // 1. Cek User Pemilik Board
  const board = await db.board.findUnique({
    where: {
      id: boardId,
      userId: session.user.id,
    },
  });

  if (!board) return { error: 'Unauthorized' };

  // 2. Hitung Order Terakhir (Agar list baru ada di paling kanan)
  const lastList = await db.list.findFirst({
    where: { boardId: boardId },
    orderBy: { order: 'desc' },
    select: { order: true },
  });

  const newOrder = lastList ? lastList.order + 1 : 1;

  // 3. Simpan List Baru
  await db.list.create({
    data: {
      title,
      boardId,
      order: newOrder,
    },
  });

  revalidatePath(`/board/${boardId}`);
  return { success: true };
}
