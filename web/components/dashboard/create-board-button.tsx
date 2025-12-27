// web/components/dashboard/create-board-button.tsx
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { createBoard } from '@/actions/create-board';
import { Plus, X, Loader2, Lock, Users, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

type FormData = {
  title: string;
  type: 'private' | 'public';
};

export const CreateBoardButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      type: 'private',
    },
  });

  const selectedType = watch('type');
  const titleValue = watch('title');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
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
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('type', data.type);

    await createBoard(formData);

    setIsSuccess(true);

    setTimeout(() => {
      reset();
      setIsOpen(false);
      setIsSuccess(false);
      router.refresh();
    }, 1500);
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
    setIsSuccess(false);
  };

  const Modal =
    mounted && isOpen
      ? createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 min-h-screen" onClick={(e) => e.target === e.currentTarget && handleClose()}>
            {/* Backdrop with animated gradient */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* Floating orbs in modal */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/10 blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/10 blur-3xl animate-pulse delay-1000 pointer-events-none" />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-900/95 backdrop-blur-xl shadow-2xl animate-in zoom-in-95 fade-in duration-300">
              {/* Shine effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent rotate-12 animate-pulse" />
              </div>

              {/* Header with gradient border */}
              <div className="relative flex items-center justify-between p-5 border-b border-zinc-700/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg shadow-teal-500/25">
                    <Plus className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-zinc-100">Buat Board Baru</h3>
                    <p className="text-xs text-zinc-500">Mulai proyek kolaborasi baru</p>
                  </div>
                </div>
                <button onClick={handleClose} className="flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all duration-200 cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Success State */}
              {isSuccess ? (
                <div className="p-8 text-center">
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 mb-5 animate-bounce">
                    <Sparkles className="h-10 w-10 text-white" />
                    <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
                  </div>
                  <h4 className="text-xl font-bold text-zinc-100 mb-2">Board Berhasil Dibuat! 🎉</h4>
                  <p className="text-sm text-zinc-400">Mempersiapkan workspace Anda...</p>
                  <div className="mt-4 flex justify-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              ) : (
                /* Form */
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                  {/* Title Input with character counter */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-zinc-300">Nama Board</label>
                      <span className={`text-xs ${(titleValue?.length || 0) > 40 ? 'text-amber-400' : 'text-zinc-500'}`}>{titleValue?.length || 0}/50</span>
                    </div>
                    <div className="relative group">
                      <input
                        {...register('title', {
                          required: 'Judul wajib diisi',
                          minLength: { value: 3, message: 'Minimal 3 karakter' },
                          maxLength: { value: 50, message: 'Maksimal 50 karakter' },
                        })}
                        type="text"
                        placeholder="Misal: Marketing Campaign 2025"
                        maxLength={50}
                        className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all duration-200"
                        autoFocus
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-500/20 via-teal-500/20 to-teal-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity -z-10 blur-sm" />
                    </div>
                    {errors.title && (
                      <p className="text-red-400 text-xs flex items-center gap-1 animate-in slide-in-from-top-1">
                        <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {/* Board Type Selection - Enhanced Cards */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-zinc-300">Tipe Board</label>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Private Option */}
                      <label
                        className={`relative flex flex-col items-center gap-3 p-5 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                          selectedType === 'private' ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10' : 'border-zinc-700 bg-zinc-800/30 hover:border-zinc-600 hover:bg-zinc-800/50'
                        }`}
                      >
                        <input type="radio" value="private" {...register('type')} className="sr-only" />
                        <div className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${selectedType === 'private' ? 'bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg' : 'bg-zinc-700'}`}>
                          <Lock className={`h-6 w-6 ${selectedType === 'private' ? 'text-white' : 'text-zinc-400'}`} />
                        </div>
                        <div className="text-center">
                          <span className={`block text-sm font-semibold ${selectedType === 'private' ? 'text-indigo-400' : 'text-zinc-300'}`}>Pribadi</span>
                          <span className="text-xs text-zinc-500 mt-1 block">Hanya Anda yang bisa akses</span>
                        </div>
                        {selectedType === 'private' && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center animate-in zoom-in">
                            <Zap className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </label>

                      {/* Public/Collaboration Option */}
                      <label
                        className={`relative flex flex-col items-center gap-3 p-5 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                          selectedType === 'public' ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10' : 'border-zinc-700 bg-zinc-800/30 hover:border-zinc-600 hover:bg-zinc-800/50'
                        }`}
                      >
                        <input type="radio" value="public" {...register('type')} className="sr-only" />
                        <div className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${selectedType === 'public' ? 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg' : 'bg-zinc-700'}`}>
                          <Users className={`h-6 w-6 ${selectedType === 'public' ? 'text-white' : 'text-zinc-400'}`} />
                        </div>
                        <div className="text-center">
                          <span className={`block text-sm font-semibold ${selectedType === 'public' ? 'text-emerald-400' : 'text-zinc-300'}`}>Kolaborasi</span>
                          <span className="text-xs text-zinc-500 mt-1 block">Undang teman via kode</span>
                        </div>
                        {selectedType === 'public' && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center animate-in zoom-in">
                            <Zap className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Info for collaboration board */}
                  {selectedType === 'public' && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 animate-in fade-in slide-in-from-top-2">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm text-emerald-300 font-medium">Tips Kolaborasi</p>
                        <p className="text-xs text-emerald-400/70 mt-1">Setelah board dibuat, Anda akan mendapatkan kode unik yang bisa dibagikan ke teman untuk bergabung.</p>
                      </div>
                    </div>
                  )}

                  {/* Footer Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                    <button type="button" onClick={handleClose} className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-all duration-200 hover: cursor-pointer">
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-glow group flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:bg-teal-500/20 border-teal-500/50 shadow-teal-500/20 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Membuat...</span>
                        </>
                      ) : (
                        <>
                          <span>Buat Board</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        id="create-board-btn"
        onClick={() => setIsOpen(true)}
        className="btn-glow group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg cursor-pointer relative overflow-hidden hover:bg-teal-500/20 border-teal-500/50 shadow-teal-500/20"
      >
        <Plus className="h-5 w-5 transition-transform group-hover:rotate-90 duration-300" />
        <span>Buat Board Baru</span>
        {/* Remove Sparkles since user deleted it */}
      </button>

      {Modal}
    </>
  );
};
