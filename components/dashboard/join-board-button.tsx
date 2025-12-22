// web/components/dashboard/join-board-button.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { joinBoard } from '@/actions/join-board';
import { UserPlus, X, Loader2, PartyPopper } from 'lucide-react';
import { useRouter } from 'next/navigation';

type FormData = {
  inviteCode: string;
};

export const JoinBoardButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string; boardId?: string } | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setResult(null);

    const formData = new FormData();
    formData.append('inviteCode', data.inviteCode);

    const response = await joinBoard(formData);

    if (response.success) {
      setResult(response);
      // Tunggu sebentar lalu redirect ke board
      setTimeout(() => {
        setIsOpen(false);
        reset();
        setResult(null);
        router.push(`/dashboard/board/${response.boardId}`);
      }, 1500);
    } else {
      setResult(response);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
    setResult(null);
  };

  return (
    <>
      {/* Tombol Join Board */}
      <button onClick={() => setIsOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-green-500 hover:shadow-lg transition-all">
        <UserPlus className="h-5 w-5" />
        Gabung Board
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-500 to-emerald-500">
              <h3 className="font-bold text-white">Gabung ke Board</h3>
              <button onClick={handleClose} className="text-white/70 hover:text-white transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Success State */}
              {result?.success ? (
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <PartyPopper className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Berhasil Bergabung!</h4>
                  <p className="text-sm text-gray-600">{result.message}</p>
                  <p className="text-xs text-gray-400 mt-2">Mengalihkan ke board...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kode Undangan</label>
                    <input
                      {...register('inviteCode', {
                        required: 'Kode undangan wajib diisi',
                        minLength: { value: 3, message: 'Kode minimal 3 karakter' },
                      })}
                      type="text"
                      placeholder="Masukkan kode, misal: ABC123"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-lg font-mono uppercase tracking-widest focus:ring-2 focus:ring-green-500 text-gray-900 focus:border-transparent outline-none transition"
                      autoFocus
                      maxLength={10}
                    />
                    {errors.inviteCode && <p className="text-red-500 text-xs mt-1">{errors.inviteCode.message}</p>}
                    {result?.error && <p className="text-red-500 text-xs mt-1">{result.error}</p>}
                  </div>

                  <p className="text-xs text-gray-500 text-center">Minta kode undangan dari pemilik board untuk bergabung</p>

                  {/* Footer Buttons */}
                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={handleClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">
                      Batal
                    </button>
                    <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition disabled:opacity-50">
                      {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                      {isSubmitting ? 'Mencari...' : 'Gabung'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
