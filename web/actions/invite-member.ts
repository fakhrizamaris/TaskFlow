// web/actions/invite-member.ts
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function inviteMember(formData: FormData) {
  const email = formData.get('email') as string;
  const boardId = formData.get('boardId') as string;

  const session = await auth();
  if (!session?.user) return { error: 'Unauthorized' };

  // 1. Cari User berdasarkan Email
  const userToInvite = await db.user.findUnique({
    where: { email },
  });

  if (!userToInvite) {
    return { error: 'User dengan email tersebut tidak ditemukan!' };
  }

  // 2. Cek apakah sudah jadi member?
  const existingMember = await db.boardMember.findUnique({
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
  const board = await db.board.findUnique({ where: { id: boardId } });
  if (board?.userId === userToInvite.id) {
    return { error: 'User ini adalah pemilik board!' };
  }

  // 4. Tambahkan ke BoardMember
  await db.boardMember.create({
    data: {
      boardId,
      userId: userToInvite.id,
      role: 'member',
    },
  });

  revalidatePath(`/board/${boardId}`);
  return { success: `Berhasil mengundang ${userToInvite.name}` };
}
