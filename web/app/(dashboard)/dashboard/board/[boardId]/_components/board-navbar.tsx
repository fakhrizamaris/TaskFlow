// web/app/(dashboard)/board/[boardId]/_components/board-navbar.tsx
'use client';

import { Board } from '@prisma/client';
import { ArrowLeft, UserPlus, X, Copy, Check, Link2, Users, Lock, Wifi, WifiOff, Mail, Sparkles, Settings, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { inviteMember } from '@/actions/invite-member';
import { deleteBoard } from '@/actions/delete-board';
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showDeleteBoardConfirm, setShowDeleteBoardConfirm] = useState(false);
  const [isDeletingBoard, setIsDeletingBoard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);
  const [mounted, setMounted] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  // Get socket context for online users and notifications
  const { isConnected, onlineUsers, lastUpdate } = useBoardSocketContext();

  const isCollaborative = !!data.inviteCode;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsInviteOpen(false);
    };
    if (isInviteOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isInviteOpen]);

  const onInvite = async (formData: FormData) => {
    setIsLoading(true);
    formData.append('boardId', data.id);

    const result = await inviteMember(formData);
    setIsLoading(false);

    if (result.error) {
      alert(result.error);
    } else {
      setEmailSent(true);
      setTimeout(() => {
        setEmailSent(false);
        setIsInviteOpen(false);
        router.refresh();
      }, 2000);
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

  const handleDeleteBoard = async () => {
    setIsDeletingBoard(true);

    const result = await deleteBoard(data.id);

    if (result.error) {
      alert(result.error);
      setIsDeletingBoard(false);
      setShowDeleteBoardConfirm(false);
    } else {
      // Redirect to dashboard after deletion
      router.push('/dashboard');
    }
  };

  const inviteLink = typeof window !== 'undefined' ? `${window.location.origin}/join?code=${data.inviteCode}` : '';

  // Delete Board Confirmation Modal
  const DeleteBoardModal =
    mounted && showDeleteBoardConfirm
      ? createPortal(
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={() => setShowDeleteBoardConfirm(false)}>
            {/* Solid dark backdrop */}
            <div className="absolute inset-0 bg-black/90" />

            {/* Modal Content */}
            <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
              {/* Close button */}
              <button onClick={() => setShowDeleteBoardConfirm(false)} className="absolute top-4 right-4 p-1 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-all">
                <X className="h-5 w-5" />
              </button>

              {/* Content */}
              <div className="text-center">
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-zinc-100 mb-2">Hapus Board?</h3>

                {/* Description */}
                <p className="text-sm text-zinc-400 mb-4">
                  Board <span className="font-semibold text-zinc-200">"{data.title}"</span> akan dihapus secara permanen.
                </p>

                {/* Warning */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                  <p className="text-sm text-red-400 flex items-center justify-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Semua list, card, dan member di board ini akan ikut terhapus!
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button onClick={() => setShowDeleteBoardConfirm(false)} className="flex-1 px-4 py-3 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-all">
                    Batal
                  </button>
                  <button
                    onClick={handleDeleteBoard}
                    disabled={isDeletingBoard}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeletingBoard ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Menghapus...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        <span>Hapus Board</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  const InviteModal =
    mounted && isInviteOpen
      ? createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setIsInviteOpen(false)}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Animated orbs */}
            <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/10 blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full bg-gradient-to-br from-blue-500/15 to-cyan-500/10 blur-3xl animate-pulse delay-700 pointer-events-none" />

            {/* Modal Content */}
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-900/95 backdrop-blur-xl shadow-2xl animate-in zoom-in-95 fade-in duration-300">
              {/* Header */}
              <div className="relative flex items-center justify-between p-5 border-b border-zinc-700/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/25">
                    <UserPlus className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-zinc-100">Undang Teman</h3>
                    <p className="text-xs text-zinc-500">Bagikan kode atau kirim undangan</p>
                  </div>
                </div>
                <button onClick={() => setIsInviteOpen(false)} className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all duration-200">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Email Sent Success State */}
              {emailSent ? (
                <div className="p-8 text-center">
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 mb-5 animate-bounce">
                    <Check className="h-10 w-10 text-white" />
                    <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
                  </div>
                  <h4 className="text-xl font-bold text-zinc-100 mb-2">Undangan Terkirim! 🎉</h4>
                  <p className="text-sm text-zinc-400">Email undangan telah dikirim ke teman Anda</p>
                </div>
              ) : (
                <div className="p-5 space-y-5">
                  {/* Kode Undangan */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                      <Sparkles className="h-4 w-4 text-emerald-400" />
                      Kode Undangan
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 font-mono text-xl font-bold text-center tracking-[0.3em] text-emerald-400">{data.inviteCode}</div>
                      <button
                        onClick={() => copyToClipboard(data.inviteCode!, 'code')}
                        className={`p-3 rounded-xl transition-all duration-200 ${
                          copied === 'code' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700 hover:border-zinc-600 hover:text-zinc-300'
                        }`}
                        title="Salin kode"
                      >
                        {copied === 'code' ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Link Undangan */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">Atau bagikan link</label>
                    <button
                      onClick={() => copyToClipboard(inviteLink, 'link')}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        copied === 'link' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800/50 border border-zinc-700 text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-400'
                      }`}
                    >
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

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-zinc-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-3 bg-zinc-900 text-zinc-500">atau undang via email</span>
                    </div>
                  </div>

                  {/* Email Form */}
                  <form action={onInvite} className="space-y-3">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="Masukkan email teman..."
                        className="w-full pl-11 pr-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-200"
                      />
                    </div>
                    <button
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4" />
                          Kirim Undangan Email
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {/* Toast Notification for realtime updates */}
      {lastUpdate && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 border border-blue-500/30">
            <span className="text-sm">
              <strong>{lastUpdate.userName}</strong> {lastUpdate.message}
            </span>
          </div>
        </div>
      )}

      <div className="w-full h-14 z-[40] bg-zinc-900/80 fixed top-0 flex items-center px-6 gap-x-4 text-white backdrop-blur-xl border-b border-zinc-800/50">
        {/* 1. TOMBOL KEMBALI */}
        <Link href="/dashboard" className="hover:bg-zinc-800 p-2 rounded-lg transition flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Kembali</span>
        </Link>

        {/* Divider */}
        <div className="h-8 w-[1px] bg-zinc-700/50 mx-2" />

        {/* Judul Board + Badge */}
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-lg text-zinc-100">{data.title}</h1>
          {isCollaborative ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Users className="h-3 w-3" />
              <span className="hidden sm:inline">Kolaborasi</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
              <Lock className="h-3 w-3" />
              <span className="hidden sm:inline">Pribadi</span>
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="ml-auto flex items-center gap-4" />

        {/* Connection Status */}
        <div className="flex items-center gap-1.5">
          {isConnected ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {onlineUsers.length > 1 ? <Users className="h-3 w-3" /> : <Wifi className="h-3 w-3" />}
              <span className="hidden sm:inline">{onlineUsers.length > 1 ? `${onlineUsers.length} Orang Online` : 'Live'}</span>
            </span>
          ) : isCollaborative ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-zinc-800 text-zinc-500 border border-zinc-700">
              <Users className="h-3 w-3" />
              <span className="hidden sm:inline">Tidak ada yang online</span>
            </span>
          ) : null}
        </div>

        {/* Online Users Avatars */}
        {onlineUsers.length > 0 && (
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {onlineUsers.slice(0, 4).map((user, index) => (
                <div key={user.id} className="relative group" style={{ zIndex: onlineUsers.length - index }}>
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full border-2 border-zinc-900 object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">{user.name.charAt(0).toUpperCase()}</div>
                  )}
                  {/* Tooltip */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-zinc-700">
                    {user.name}
                  </div>
                  {/* Online indicator */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-zinc-900 rounded-full"></span>
                </div>
              ))}
              {onlineUsers.length > 4 && <div className="w-8 h-8 rounded-full border-2 border-zinc-900 bg-zinc-700 flex items-center justify-center text-xs font-bold text-white">+{onlineUsers.length - 4}</div>}
            </div>
            <span className="ml-2 text-xs text-zinc-500 hidden sm:inline">{onlineUsers.length} online</span>
          </div>
        )}

        {/* 2. TOMBOL INVITE / SHARE */}
        {isCollaborative && (
          <button
            onClick={() => setIsInviteOpen(!isInviteOpen)}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-x-2 transition-all duration-200 cursor-pointer shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
          >
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Undang</span>
          </button>
        )}

        {/* 3. TOMBOL SETTINGS */}
        <div className="relative">
          <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all" title="Pengaturan Board">
            <Settings className="h-5 w-5" />
          </button>

          {/* Settings Dropdown */}
          {isSettingsOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsSettingsOpen(false)} />
              <div className="absolute right-0 top-full mt-2 z-50 w-48 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-1">
                  <div className="px-3 py-2 text-xs font-medium text-zinc-500 border-b border-zinc-700">Pengaturan Board</div>
                  <button
                    onClick={() => {
                      setIsSettingsOpen(false);
                      setShowDeleteBoardConfirm(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all mt-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Hapus Board</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {InviteModal}
      {DeleteBoardModal}
    </>
  );
};
