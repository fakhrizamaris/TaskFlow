// web/actions/join-board.ts
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function joinBoard(formData: FormData) {
  const inviteCode = (formData.get('inviteCode') as string)?.toUpperCase().trim();

  const session = await auth();
  if (!session?.user || !session.user.id) {
    return { error: 'Anda harus login terlebih dahulu!' };
  }

  if (!inviteCode || inviteCode.length < 3) {
    return { error: 'Kode undangan tidak valid!' };
  }

  // 1. Cari board dengan invite code tersebut
  const board = await db.board.findFirst({
    where: { inviteCode },
    select: { id: true, title: true, userId: true },
  });

  if (!board) {
    return { error: 'Board dengan kode tersebut tidak ditemukan!' };
  }

  // 2. Cek apakah user adalah pemilik board?
  if (board.userId === session.user.id) {
    return { error: 'Anda adalah pemilik board ini!' };
  }

  // 3. Cek apakah sudah menjadi member?
  const existingMember = await db.boardMember.findUnique({
    where: {
      boardId_userId: {
        boardId: board.id,
        userId: session.user.id,
      },
    },
  });

  if (existingMember) {
    return { error: 'Anda sudah bergabung di board ini!', boardId: board.id };
  }

  // 4. Tambahkan sebagai member baru
  await db.boardMember.create({
    data: {
      boardId: board.id,
      userId: session.user.id,
      role: 'member',
    },
  });

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/board/${board.id}`);

  return {
    success: true,
    message: `Berhasil bergabung ke board "${board.title}"!`,
    boardId: board.id,
  };
}
