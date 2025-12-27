// actions/invite-member.ts
'use server';

import { defaultDeps, type Dependencies } from '@/lib/deps';
import { revalidatePath } from 'next/cache';

// Internal function yang bisa di-test
export async function _inviteMember(formData: FormData, deps: Dependencies = defaultDeps) {
  const email = formData.get('email') as string;
  const boardId = formData.get('boardId') as string;

  const session = await deps.auth();
  if (!session?.user) return { error: 'Unauthorized' };

  // 1. Cari User berdasarkan Email
  const userToInvite = await deps.db.user.findUnique({
    where: { email },
  });

  if (!userToInvite) {
    return { error: 'User dengan email tersebut tidak ditemukan!' };
  }

  // 2. Cek apakah sudah jadi member?
  const existingMember = await deps.db.boardMember.findUnique({
    where: {
      boardId_userId: {
        boardId,
        userId: userToInvite.id,
      },
    },
  });

  if (existingMember) {
    return { error: 'User ini sudah ada di dalam board!' };
  }

  // 3. Cek apakah dia Owner? (Owner gak perlu diinvite)
  const board = await deps.db.board.findUnique({ where: { id: boardId } });
  if (board?.userId === userToInvite.id) {
    return { error: 'User ini adalah pemilik board!' };
  }

  // 4. Tambahkan ke BoardMember
  await deps.db.boardMember.create({
    data: {
      boardId,
      userId: userToInvite.id,
      role: 'member',
    },
  });

  revalidatePath(`/board/${boardId}`);
  return { success: `Berhasil mengundang ${userToInvite.name}` };
}

// Server action wrapper
export async function inviteMember(formData: FormData) {
  return _inviteMember(formData);
}
