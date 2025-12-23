// web/components/dashboard/join-board-button.tsx
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { joinBoard } from '@/actions/join-board';
import { UserPlus, X, Loader2, PartyPopper, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type FormData = {
  inviteCode: string;
};

export const JoinBoardButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string; boardId?: string } | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const codeValue = watch('inviteCode');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const onSubmit = async (data: FormData) => {
    setResult(null);

    const formData = new FormData();
    formData.append('inviteCode', data.inviteCode);

    const response = await joinBoard(formData);

    if (response.success) {
      setResult(response);
      setTimeout(() => {
        setIsOpen(false);
        reset();
        setResult(null);
        router.push(`/dashboard/board/${response.boardId}`);
      }, 2000);
    } else {
      setResult(response);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
    setResult(null);
  };

  const Modal =
    mounted && isOpen
      ? createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 min-h-screen" onClick={(e) => e.target === e.currentTarget && handleClose()}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Animated Gradient Orbs */}
            <div className="absolute top-1/3 left-1/3 w-72 h-72 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/10 blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/3 w-56 h-56 rounded-full bg-gradient-to-br from-cyan-500/15 to-teal-500/10 blur-3xl animate-pulse delay-700 pointer-events-none" />

            {/* Modal Content */}
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-900/95 backdrop-blur-xl shadow-2xl animate-in zoom-in-95 fade-in duration-300">
              {/* Header */}
              <div className="relative flex items-center justify-between p-5 border-b border-zinc-700/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/25">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-zinc-100">Gabung ke Board</h3>
                    <p className="text-xs text-zinc-500">Masukkan kode undangan dari teman</p>
                  </div>
                </div>
                <button onClick={handleClose} className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all duration-200">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {/* Success State */}
                {result?.success ? (
                  <div className="text-center py-6">
                    <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 mb-5">
                      <PartyPopper className="h-10 w-10 text-white animate-bounce" />
                      <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
                      {/* Confetti particles */}
                      <div className="absolute -top-4 -left-4 w-3 h-3 rounded-full bg-yellow-400 animate-ping" />
                      <div className="absolute -top-2 -right-6 w-2 h-2 rounded-full bg-pink-400 animate-ping delay-150" />
                      <div className="absolute -bottom-3 -left-2 w-2 h-2 rounded-full bg-cyan-400 animate-ping delay-300" />
                      <div className="absolute -bottom-5 -right-4 w-3 h-3 rounded-full bg-purple-400 animate-ping delay-100" />
                    </div>
                    <h4 className="text-xl font-bold text-zinc-100 mb-2">Berhasil Bergabung! 🎉</h4>
                    <p className="text-sm text-zinc-400">{result.message}</p>
                    <div className="mt-4 flex justify-center items-center gap-2 text-emerald-400">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-xs">Mengalihkan ke board...</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Invite Code Input */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-zinc-300">Kode Undangan</label>
                      <div className="relative group">
                        <input
                          {...register('inviteCode', {
                            required: 'Kode undangan wajib diisi',
                            minLength: { value: 6, message: 'Kode harus 6 karakter' },
                            maxLength: { value: 6, message: 'Kode harus 6 karakter' },
                          })}
                          type="text"
                          placeholder="ABC123"
                          className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-4 text-center text-2xl font-mono uppercase tracking-[0.5em] text-zinc-100 placeholder:text-zinc-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all duration-200"
                          autoFocus
                          maxLength={6}
                        />
                        {/* Glow effect when typing */}
                        {codeValue?.length > 0 && <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-emerald-500/20 -z-10 blur-sm animate-pulse" />}
                      </div>

                      {/* Character indicators */}
                      <div className="flex justify-center gap-1">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className={`w-8 h-1 rounded-full transition-all duration-200 ${i < (codeValue?.length || 0) ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-zinc-700'}`} />
                        ))}
                      </div>

                      {errors.inviteCode && (
                        <p className="text-red-400 text-xs flex items-center justify-center gap-1 animate-in slide-in-from-top-1">
                          <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                          {errors.inviteCode.message}
                        </p>
                      )}
                      {result?.error && (
                        <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 animate-in fade-in slide-in-from-top-2">
                          <X className="h-4 w-4 text-red-400" />
                          <p className="text-red-400 text-sm">{result.error}</p>
                        </div>
                      )}
                    </div>

                    {/* Helper text */}
                    <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                      <CheckCircle2 className="h-4 w-4 text-zinc-500" />
                      <p className="text-xs text-zinc-500">Minta kode undangan dari pemilik board untuk bergabung</p>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-between pt-2">
                      <button type="button" onClick={handleClose} className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-all duration-200">
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !codeValue?.length}
                        className="group flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl hover:from-emerald-500 hover:to-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Mencari...</span>
                          </>
                        ) : (
                          <>
                            <span>Gabung</span>
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 cursor-pointer relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        <UserPlus className="h-5 w-5 transition-transform group-hover:scale-110 duration-300" />
        <span>Gabung Board</span>
      </button>

      {Modal}
    </>
  );
};
