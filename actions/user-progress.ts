// web/actions/user-progress.ts
'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function completeTutorial() {
  const session = await auth();

  if (!session?.user?.email) return;

  // Update status user di database
  await db.user.update({
    where: { email: session.user.email },
    data: { tutorialCompleted: true },
  });

  // Refresh halaman dashboard agar data terbaru terbaca
  revalidatePath('/dashboard');
}
