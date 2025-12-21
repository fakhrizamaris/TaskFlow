// web/components/dashboard/create-board-button.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createBoard } from '@/actions/create-board';
import { Plus, X, Loader2 } from 'lucide-react'; // Ikon
import { useRouter } from 'next/navigation';

export const CreateBoardButton = () => {
  const [isOpen, setIsOpen] = useState(false); // State untuk buka/tutup modal
  const router = useRouter();

  // Setup React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<{ title: string }>();

  // Fungsi saat form disubmit
  const onSubmit = async (data: { title: string }) => {
    // Kita convert object ke FormData agar cocok dengan Server Action
    const formData = new FormData();
    formData.append('title', data.title);

    await createBoard(formData);

    // Reset dan Tutup Modal
    reset();
    setIsOpen(false);
    router.refresh(); // Pastikan UI terupdate
  };

  return (
    <>
      {/* Tombol Pemicu (Trigger) */}
      {/* PENTING: ID ini harus sama dengan target Tutorial Driver.js */}
      <button id="create-board-btn" onClick={() => setIsOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-500 hover:shadow-lg transition-all">
        <Plus className="h-5 w-5" />
        Buat Board Baru
      </button>

      {/* Modal / Pop-up Manual (Tanpa library berat) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h3 className="font-bold text-gray-800">Buat Board Baru</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-red-500 transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Board</label>
                <input
                  {...register('title', {
                    required: 'Judul wajib diisi',
                    minLength: { value: 3, message: 'Minimal 3 huruf' },
                  })}
                  type="text"
                  placeholder="Misal: Marketing Campaign 2025"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 text-gray-900 focus:border-transparent outline-none transition"
                  autoFocus // Otomatis fokus saat modal buka
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Menyimpan...' : 'Buat Board'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
