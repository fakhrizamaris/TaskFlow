// web/actions/create-card.ts
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createCard(formData: FormData) {
  const session = await auth();
  const title = formData.get('title') as string;
  const listId = formData.get('listId') as string;
  const boardId = formData.get('boardId') as string;

  if (!session?.user || !title || !listId || !boardId) {
    return { error: 'Data tidak lengkap' };
  }

  // 1. Cek User (Keamanan)
  const board = await db.board.findUnique({
    where: {
      id: boardId,
      userId: session.user.id,
    },
  });

  if (!board) return { error: 'Unauthorized' };

  // 2. Cari order terakhir di list ini
  const lastCard = await db.card.findFirst({
    where: { listId },
    orderBy: { order: 'desc' },
    select: { order: true },
  });

  const newOrder = lastCard ? lastCard.order + 1 : 1;

  // 3. Simpan Kartu
  await db.card.create({
    data: {
      title,
      listId,
      order: newOrder,
      authorId: session.user.id,
    },
  });

  // 4. Update UI
  revalidatePath(`/board/${boardId}`);
  return { success: true };
}
