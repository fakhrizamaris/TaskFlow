// web/components/dashboard/create-board-button.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createBoard } from '@/actions/create-board';
import { Plus, X, Loader2, Lock, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

type FormData = {
  title: string;
  type: 'private' | 'public';
};

export const CreateBoardButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      type: 'private', // Default ke private
    },
  });

  const selectedType = watch('type');

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('type', data.type);

    await createBoard(formData);

    reset();
    setIsOpen(false);
    router.refresh();
  };

  return (
    <>
      {/* Tombol Pemicu (Trigger) */}
      <button id="create-board-btn" onClick={() => setIsOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-500 hover:shadow-lg transition-all">
        <Plus className="h-5 w-5" />
        Buat Board Baru
      </button>

      {/* Modal */}
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
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              {/* Input Judul */}
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
                  autoFocus
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>

              {/* Pilihan Tipe Board */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Board</label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Option: Private */}
                  <label
                    className={`relative flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedType === 'private' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <input type="radio" value="private" {...register('type')} className="sr-only" />
                    <Lock className={`h-6 w-6 ${selectedType === 'private' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${selectedType === 'private' ? 'text-blue-700' : 'text-gray-600'}`}>Pribadi</span>
                    <span className="text-xs text-gray-400 text-center">Hanya Anda yang bisa akses</span>
                  </label>

                  {/* Option: Public/Kolaborasi */}
                  <label
                    className={`relative flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedType === 'public' ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <input type="radio" value="public" {...register('type')} className="sr-only" />
                    <Users className={`h-6 w-6 ${selectedType === 'public' ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${selectedType === 'public' ? 'text-green-700' : 'text-gray-600'}`}>Kolaborasi</span>
                    <span className="text-xs text-gray-400 text-center">Undang teman via kode</span>
                  </label>
                </div>
              </div>

              {/* Info untuk board kolaborasi */}
              {selectedType === 'public' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs text-green-700">
                    <strong>💡 Tips:</strong> Setelah board dibuat, Anda akan mendapatkan kode unik yang bisa dibagikan ke teman untuk bergabung.
                  </p>
                </div>
              )}

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
