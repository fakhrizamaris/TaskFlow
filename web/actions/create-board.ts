// actions/create-board.ts
'use server';

import { defaultDeps, type Dependencies } from '@/lib/deps';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';

// Internal function yang bisa di-test
export async function _createBoard(formData: FormData, deps: Dependencies = defaultDeps) {
  const session = await deps.auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };

  const title = formData.get('title') as string;
  const type = formData.get('type') as string;

  if (!title || title.length < 3) {
    return { error: 'Judul board minimal 3 huruf!' };
  }

  let inviteCode = null;
  if (type === 'public') {
    inviteCode = randomUUID().substring(0, 6).toUpperCase();
  }

  await deps.db.board.create({
    data: { title, userId: session.user.id, inviteCode },
  });

  revalidatePath('/dashboard');
  return { success: true };
}

// Server action wrapper (untuk digunakan di client)
export async function createBoard(formData: FormData) {
  return _createBoard(formData);
}
