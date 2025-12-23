// web/components/dashboard/board-card.tsx
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Users, Calendar, Clock, ArrowRight, Trash2, X, Loader2, AlertTriangle, MoreVertical } from 'lucide-react';
import { deleteBoard } from '@/actions/delete-board';

interface BoardCardProps {
  board: {
    id: string;
    title: string;
    inviteCode?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  index: number;
  isOwner: boolean;
}

export const BoardCard = ({ board, index, isOwner }: BoardCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDeleting(true);

    const result = await deleteBoard(board.id);

    if (result.error) {
      alert(result.error);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(false);
      router.refresh();
    }
  };

  // Delete Confirmation Modal
  const DeleteModal =
    mounted && showDeleteConfirm
      ? createPortal(
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
            {/* Solid dark backdrop */}
            <div className="absolute inset-0 bg-black/90" />

            {/* Modal Content */}
            <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
              {/* Close button */}
              <button onClick={() => setShowDeleteConfirm(false)} className="absolute top-4 right-4 p-1 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-all">
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
                  Board <span className="font-semibold text-zinc-200">"{board.title}"</span> akan dihapus secara permanen.
                </p>

                {/* Warning */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                  <p className="text-sm text-red-400 flex items-center justify-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Semua list, card, dan member akan ikut terhapus!
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-3 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-all">
                    Batal
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Menghapus...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        <span>Hapus</span>
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

  return (
    <>
      <div className="glass-card p-5 rounded-xl hover:border-indigo-500/30 transition-all duration-300 cursor-pointer group relative overflow-hidden h-full" style={{ animationDelay: `${index * 50}ms` }}>
        {/* Hover glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-300" />

        {/* Badge tipe board */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          {board.inviteCode ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm">
              <Users className="h-3 w-3" />
              <span className="hidden sm:inline">Kolaborasi</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-700/50 text-zinc-400 border border-zinc-600/50 backdrop-blur-sm">
              <Lock className="h-3 w-3" />
              <span className="hidden sm:inline">Pribadi</span>
            </span>
          )}

          {/* Menu Button - Only for owners */}
          {isOwner && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700/50 transition-all opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsMenuOpen(false);
                    }}
                  />
                  <div className="absolute right-0 top-full mt-1 z-50 w-40 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2" onClick={(e) => e.stopPropagation()}>
                    <div className="p-1">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsMenuOpen(false);
                          setShowDeleteConfirm(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Hapus Board</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <Link href={`/dashboard/board/${board.id}`} className="block">
          <div className="relative">
            <h3 className="font-bold text-lg text-zinc-200 group-hover:text-indigo-400 transition pr-24 line-clamp-1">{board.title}</h3>

            <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(board.createdAt).toLocaleDateString('id-ID')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(board.updatedAt).toLocaleDateString('id-ID')}
              </span>
            </div>

            {/* Quick action hint */}
            <div className="mt-4 flex items-center gap-1 text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Buka board</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>

      {DeleteModal}
    </>
  );
};
