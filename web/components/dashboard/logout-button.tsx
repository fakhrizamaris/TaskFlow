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
      id="logout-btn"
      onClick={handleLogout}
      className="btn-glow inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all cursor-pointer hover:bg-rose-500/20 border-rose-500/50 shadow-lg shadow-rose-500/20"
    >
      <LogOut className="h-4 w-4" />
      <span className="hidden sm:inline">Logout</span>
    </button>
  );
};
