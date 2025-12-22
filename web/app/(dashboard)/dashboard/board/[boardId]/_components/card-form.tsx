// web/app/(dashboard)/board/[boardId]/_components/card-form.tsx
'use client';

import { useState, useRef, ElementRef } from 'react';
import { Plus, X } from 'lucide-react';
import { createCard } from '@/actions/create-card';
import { useParams } from 'next/navigation';
import { useBoardSocketContext } from '@/providers/board-socket-provider';

interface CardFormProps {
  listId: string;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}

export const CardForm = ({ listId, isEditing, enableEditing, disableEditing }: CardFormProps) => {
  const params = useParams();
  const formRef = useRef<ElementRef<'form'>>(null);
  const { emitBoardUpdate, emitInteraction, activeInteractions } = useBoardSocketContext();

  // Check if someone else is typing in this list
  // We use listId as targetId for typing in a list
  const activeUser = activeInteractions[`typing-${listId}`];
  const isTypingByOther = activeUser && activeUser.type === 'typing-start';

  const onSubmit = async (formData: FormData) => {
    formData.append('listId', listId);
    formData.append('boardId', params.boardId as string);

    await createCard(formData);
    formRef.current?.reset(); // Kosongkan form setelah simpan

    // ✅ Notify user lain bahwa ada kartu baru
    emitBoardUpdate('Kartu baru ditambahkan');
    emitInteraction('typing-end', `typing-${listId}`); // Stop typing indicator
  };

  const onTyping = () => {
    emitInteraction('typing-start', `typing-${listId}`);
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
          onChange={onTyping} // Emit typing event
          className="w-full resize-none shadow-sm rounded-md border-none focus:ring-2 ring-blue-500 p-2 text-sm text-black placeholder:text-gray-400"
        />
        <div className="flex items-center gap-x-1">
          <button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700 text-sm py-1.5 px-3 rounded font-medium">
            Tambah
          </button>
          <button
            onClick={() => {
              disableEditing();
              emitInteraction('typing-end', `typing-${listId}`);
            }}
            type="button"
            className="p-1.5 text-gray-500 hover:bg-gray-200 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </form>
    );
  }

  if (isTypingByOther) {
    return (
      <div className="pt-2 px-2 pb-2">
        <div className="flex items-center gap-2 text-xs text-gray-500 italic animate-pulse">
          <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center text-[8px] font-bold text-gray-600">{activeUser.userName.charAt(0)}</div>
          {activeUser.userName} sedang mengetik...
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2 px-2">
      <button onClick={enableEditing} className="h-auto px-2 py-1.5 w-full justify-start text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded text-sm font-medium flex items-center gap-x-1 transition cursor-pointer">
        <Plus className="h-4 w-4" />
        Tambah Kartu
      </button>
    </div>
  );
};
