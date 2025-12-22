'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
// Kita pakai crypto bawaan Node.js untuk bikin kode acak
import { randomUUID } from 'crypto';

export async function createBoard(formData: FormData) {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return { error: 'Unauthorized' };
  }

  const title = formData.get('title') as string;
  const type = formData.get('type') as string; // "private" atau "public"

  if (!title || title.length < 3) {
    return { error: 'Judul board minimal 3 huruf!' };
  }

  // LOGIKA GENERATE KODE
  let inviteCode = null;
  if (type === 'public') {
    // Kita ambil 6 karakter pertama dari UUID biar kodenya pendek
    inviteCode = randomUUID().substring(0, 6).toUpperCase();
  }

  await db.board.create({
    data: {
      title,
      userId: session.user.id,
      inviteCode, // Simpan kodenya (atau null jika private)
    },
  });

  revalidatePath('/dashboard');
  return { success: true };
}
