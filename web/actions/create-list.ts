// actions/create-list.ts
'use server';

import { defaultDeps, type Dependencies } from '@/lib/deps';
import { revalidatePath } from 'next/cache';

// Internal function yang bisa di-test
export async function _createList(formData: FormData, deps: Dependencies = defaultDeps) {
  const session = await deps.auth();
  const boardId = formData.get('boardId') as string;
  const title = formData.get('title') as string;

  if (!session?.user || !boardId || !title) return { error: 'Data tidak lengkap' };

  // 1. Cek User Pemilik Board
  const board = await deps.db.board.findUnique({
    where: {
      id: boardId,
      userId: session.user.id,
    },
  });

  if (!board) return { error: 'Unauthorized' };

  // 2. Hitung Order Terakhir (Agar list baru ada di paling kanan)
  const lastList = await deps.db.list.findFirst({
    where: { boardId: boardId },
    orderBy: { order: 'desc' },
    select: { order: true },
  });

  const newOrder = lastList ? lastList.order + 1 : 1;

  // 3. Simpan List Baru
  await deps.db.list.create({
    data: {
      title,
      boardId,
      order: newOrder,
    },
  });

  revalidatePath(`/board/${boardId}`);
  return { success: true };
}

// Server action wrapper
export async function createList(formData: FormData) {
  return _createList(formData);
}
