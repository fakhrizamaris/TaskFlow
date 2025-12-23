// web/components/dashboard/logout-button.tsx
'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export const LogoutButton = () => {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 transition-all cursor-pointer"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
};
