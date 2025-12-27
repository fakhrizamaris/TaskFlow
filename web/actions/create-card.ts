// actions/create-card.ts
'use server';

import { defaultDeps, type Dependencies } from '@/lib/deps';
import { revalidatePath } from 'next/cache';

// Internal function yang bisa di-test
export async function _createCard(formData: FormData, deps: Dependencies = defaultDeps) {
  const session = await deps.auth();
  const title = formData.get('title') as string;
  const listId = formData.get('listId') as string;
  const boardId = formData.get('boardId') as string;

  if (!session?.user?.id || !title || !listId || !boardId) {
    return { error: 'Data tidak lengkap' };
  }

  // 1. Cek User (Keamanan)
  const board = await deps.db.board.findUnique({
    where: {
      id: boardId,
      userId: session.user.id,
    },
  });

  if (!board) return { error: 'Unauthorized' };

  // 2. Cari order terakhir di list ini
  const lastCard = await deps.db.card.findFirst({
    where: { listId },
    orderBy: { order: 'desc' },
    select: { order: true },
  });

  const newOrder = lastCard ? lastCard.order + 1 : 1;

  // 3. Simpan Kartu
  await deps.db.card.create({
    data: {
      title,
      listId,
      order: newOrder,
      authorId: session.user.id!,
    },
  });

  // 4. Update UI
  revalidatePath(`/dashboard/board/${boardId}`);
  return { success: true };
}

// Server action wrapper
export async function createCard(formData: FormData) {
  return _createCard(formData);
}
