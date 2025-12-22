// web/app/join/_components/join-board-form.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { joinBoard } from '@/actions/join-board';
import { Loader2, PartyPopper, Users, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type FormData = {
  inviteCode: string;
};

interface JoinBoardFormProps {
  initialCode: string;
}

export const JoinBoardForm = ({ initialCode }: JoinBoardFormProps) => {
  const [result, setResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
    boardId?: string;
  } | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      inviteCode: initialCode,
    },
  });

  const onSubmit = useCallback(
    async (data: FormData) => {
      setResult(null);

      const formData = new FormData();
      formData.append('inviteCode', data.inviteCode);

      const response = await joinBoard(formData);

      if (response.success) {
        setResult(response);
        // Redirect ke board setelah 1.5 detik
        setTimeout(() => {
          router.push(`/dashboard/board/${response.boardId}`);
        }, 1500);
      } else {
        setResult(response);
      }
    },
    [router]
  );

  // Auto-submit jika ada kode di URL
  useEffect(() => {
    if (initialCode && initialCode.length >= 3) {
      // Auto submit setelah 500ms
      const timeout = setTimeout(() => {
        handleSubmit(onSubmit)();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [initialCode, handleSubmit, onSubmit]);

  return (
    <div className="w-full max-w-md">
      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
            <Users className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">Gabung ke Board</h1>
          <p className="text-green-100 text-sm mt-1">Masukkan kode undangan untuk bergabung</p>
        </div>

        {/* Body */}
        <div className="p-6">
          {result?.success ? (
            // Success State
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4 animate-bounce">
                <PartyPopper className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Berhasil Bergabung!</h2>
              <p className="text-gray-600">{result.message}</p>
              <p className="text-sm text-gray-400 mt-4">Mengalihkan ke board...</p>
            </div>
          ) : (
            // Form State
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kode Undangan</label>
                <input
                  {...register('inviteCode', {
                    required: 'Kode undangan wajib diisi',
                    minLength: { value: 3, message: 'Kode minimal 3 karakter' },
                  })}
                  type="text"
                  placeholder="Masukkan kode, misal: ABC123"
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-4 text-center text-2xl font-mono uppercase tracking-widest focus:ring-2 focus:ring-green-500 text-gray-900 focus:border-green-500 outline-none transition"
                  autoFocus={!initialCode}
                  maxLength={10}
                />
                {errors.inviteCode && <p className="text-red-500 text-xs mt-2 text-center">{errors.inviteCode.message}</p>}
                {result?.error && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm text-center">{result.error}</p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
                {isSubmitting ? 'Mencari board...' : 'Gabung Sekarang'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <Link href="/dashboard" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Dashboard
          </Link>
        </div>
      </div>

      {/* Info Text */}
      <p className="text-center text-green-100 text-sm mt-6">Minta kode undangan dari pemilik board untuk bergabung</p>
    </div>
  );
};
