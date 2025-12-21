// web/app/(dashboard)/board/[boardId]/_components/card-form.tsx
'use client';

import { useState, useRef, ElementRef } from 'react';
import { Plus, X } from 'lucide-react';
import { createCard } from '@/actions/create-card';
import { useParams } from 'next/navigation';

interface CardFormProps {
  listId: string;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}

export const CardForm = ({ listId, isEditing, enableEditing, disableEditing }: CardFormProps) => {
  const params = useParams();
  const formRef = useRef<ElementRef<'form'>>(null);

  const onSubmit = async (formData: FormData) => {
    formData.append('listId', listId);
    formData.append('boardId', params.boardId as string);

    await createCard(formData);
    formRef.current?.reset(); // Kosongkan form setelah simpan
    // Kita tidak disableEditing agar user bisa nambah banyak kartu sekaligus
  };

  if (isEditing) {
    return (
      <form ref={formRef} action={onSubmit} className="m-1 py-0.5 px-1 space-y-4">
        <textarea
          autoFocus
          id="title"
          name="title"
          placeholder="Apa tugasnya..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
          className="w-full resize-none shadow-sm rounded-md border-none focus:ring-2 ring-blue-500 p-2 text-sm text-black placeholder:text-gray-400"
        />
        <div className="flex items-center gap-x-1">
          <button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700 text-sm py-1.5 px-3 rounded font-medium">
            Tambah
          </button>
          <button onClick={disableEditing} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded">
            <X className="h-4 w-4" />
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="pt-2 px-2">
      <button onClick={enableEditing} className="h-auto px-2 py-1.5 w-full justify-start text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded text-sm font-medium flex items-center gap-x-1 transition">
        <Plus className="h-4 w-4" />
        Tambah Kartu
      </button>
    </div>
  );
};
