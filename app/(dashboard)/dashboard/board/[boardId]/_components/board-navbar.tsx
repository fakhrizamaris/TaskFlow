// web/app/(dashboard)/board/[boardId]/_components/board-navbar.tsx
'use client';

import { Board } from '@prisma/client';
import { ArrowLeft, UserPlus, X, Copy, Check, Link2, Users, Lock, Wifi, WifiOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { inviteMember } from '@/actions/invite-member';
import { useRouter } from 'next/navigation';
import { useBoardSocketContext } from '@/providers/board-socket-provider';

// Extend Board type to include inviteCode (in case Prisma types aren't updated)
type BoardWithInviteCode = Board & {
  inviteCode?: string | null;
};

interface BoardNavbarProps {
  data: BoardWithInviteCode;
}

export const BoardNavbar = ({ data }: BoardNavbarProps) => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);
  const router = useRouter();

  // Get socket context for online users and notifications
  const { isConnected, onlineUsers, lastUpdate } = useBoardSocketContext();

  const isCollaborative = !!data.inviteCode;

  const onInvite = async (formData: FormData) => {
    setIsLoading(true);
    formData.append('boardId', data.id);

    const result = await inviteMember(formData);
    setIsLoading(false);

    if (result.error) {
      alert(result.error);
    } else {
      alert(result.success);
      setIsInviteOpen(false);
      router.refresh();
    }
  };

  const copyToClipboard = async (text: string, type: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      alert('Gagal menyalin ke clipboard');
    }
  };

  const inviteLink = typeof window !== 'undefined' ? `${window.location.origin}/join?code=${data.inviteCode}` : '';

  return (
    <>
      {/* Toast Notification for realtime updates */}
      {lastUpdate && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <span className="text-sm">
              <strong>{lastUpdate.userName}</strong> {lastUpdate.message}
            </span>
          </div>
        </div>
      )}

      <div className="w-full h-14 z-[40] bg-black/50 fixed top-0 flex items-center px-6 gap-x-4 text-white backdrop-blur-sm">
        {/* 1. TOMBOL KEMBALI */}
        <Link href="/dashboard" className="hover:bg-white/20 p-2 rounded-md transition flex items-center gap-2 text-sm font-medium">
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>

        {/* Divider */}
        <div className="h-8 w-[1px] bg-white/30 mx-2" />

        {/* Judul Board + Badge */}
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-lg">{data.title}</h1>
          {isCollaborative ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
              <Users className="h-3 w-3" />
              Kolaborasi
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/70 border border-white/20">
              <Lock className="h-3 w-3" />
              Pribadi
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="ml-auto flex items-center gap-4" />

        {/* Connection Status */}
        <div className="flex items-center gap-1.5">
          {isConnected ? (
            <span className="flex items-center gap-1 text-xs text-green-400">
              <Wifi className="h-3 w-3" />
              <span className="hidden sm:inline">Live</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-red-400">
              <WifiOff className="h-3 w-3" />
              <span className="hidden sm:inline">Offline</span>
            </span>
          )}
        </div>

        {/* Online Users Avatars */}
        {onlineUsers.length > 0 && (
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {onlineUsers.slice(0, 4).map((user, index) => (
                <div key={user.id} className="relative group" style={{ zIndex: onlineUsers.length - index }}>
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full border-2 border-white/20 object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">{user.name.charAt(0).toUpperCase()}</div>
                  )}
                  {/* Tooltip */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">{user.name}</div>
                  {/* Online indicator */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black/50 rounded-full"></span>
                </div>
              ))}
              {onlineUsers.length > 4 && <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-gray-600 flex items-center justify-center text-xs font-bold text-white">+{onlineUsers.length - 4}</div>}
            </div>
            <span className="ml-2 text-xs text-white/60 hidden sm:inline">{onlineUsers.length} online</span>
          </div>
        )}

        {/* 2. TOMBOL INVITE / SHARE */}
        {isCollaborative && (
          <div className="relative">
            <button onClick={() => setIsInviteOpen(!isInviteOpen)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-x-2 transition cursor-pointer">
              <UserPlus className="h-4 w-4" />
              Undang
            </button>

            {/* Pop-up Invite */}
            {isInviteOpen && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl text-black border border-gray-200 animate-in fade-in slide-in-from-top-2 overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                  <h3 className="font-semibold text-sm">Undang Teman</h3>
                  <button onClick={() => setIsInviteOpen(false)}>
                    <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  {/* Kode Undangan */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Kode Undangan</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3 font-mono text-lg font-bold text-center tracking-widest text-gray-800">{data.inviteCode}</div>
                      <button onClick={() => copyToClipboard(data.inviteCode!, 'code')} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition" title="Salin kode">
                        {copied === 'code' ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5 text-gray-600" />}
                      </button>
                    </div>
                  </div>

                  {/* Link Undangan */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">Atau bagikan link</label>
                    <button onClick={() => copyToClipboard(inviteLink, 'link')} className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2.5 rounded-lg text-sm font-medium transition">
                      {copied === 'link' ? (
                        <>
                          <Check className="h-4 w-4" />
                          Link Tersalin!
                        </>
                      ) : (
                        <>
                          <Link2 className="h-4 w-4" />
                          Salin Link Undangan
                        </>
                      )}
                    </button>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-xs text-gray-500 mb-3">Atau undang via email:</p>
                    <form action={onInvite} className="space-y-3">
                      <input name="email" type="email" required placeholder="Masukkan email teman..." className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      <button disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition disabled:opacity-50">
                        {isLoading ? 'Mengirim...' : 'Kirim Undangan Email'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
