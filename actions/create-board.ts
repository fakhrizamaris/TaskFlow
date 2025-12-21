// web/actions/create-board.ts
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createBoard(formData: FormData) {
  // 1. Cek User Login
  const session = await auth();
  if (!session?.user || !session.user.id) {
    throw new Error('Unauthorized');
  }

  // 2. Ambil data dari form
  const title = formData.get('title') as string;

  // Validasi sederhana
  if (!title || title.length < 3) {
    return { error: 'Judul board minimal 3 huruf!' };
  }

  // 3. Simpan ke Database
  await db.board.create({
    data: {
      title,
      userId: session.user.id,
    },
  });

  // 4. Refresh Dashboard agar board baru muncul
  revalidatePath('/dashboard');

  // (Opsional) Langsung redirect ke board baru?
  // Tapi untuk sekarang kita stay di dashboard dulu
  return { success: true };
}
