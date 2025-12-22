// web/app/join/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { JoinBoardForm } from './_components/join-board-form';

interface JoinPageProps {
  searchParams: Promise<{
    code?: string;
  }>;
}

export default async function JoinPage({ searchParams }: JoinPageProps) {
  const session = await auth();

  // Redirect ke login jika belum login
  if (!session?.user) {
    const { code } = await searchParams;
    const callbackUrl = code ? `/join?code=${code}` : '/join';
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const { code } = await searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center p-4">
      <JoinBoardForm initialCode={code || ''} />
    </div>
  );
}
