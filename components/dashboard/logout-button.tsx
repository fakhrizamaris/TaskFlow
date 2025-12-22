// web/components/dashboard/logout-button.tsx
'use client';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export const LogoutButton = () => {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer">
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
};
