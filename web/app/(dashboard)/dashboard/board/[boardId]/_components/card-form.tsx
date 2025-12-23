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
      <form ref={formRef} action={onSubmit} className="m-1 py-0.5 px-1 space-y-3">
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
          className="w-full resize-none shadow-sm rounded-lg border border-zinc-600/50 bg-zinc-900/80 focus:ring-2 ring-indigo-500/50 focus:border-indigo-500/50 p-3 text-sm text-zinc-200 placeholder:text-zinc-500"
        />
        <div className="flex items-center gap-x-2">
          <button type="submit" className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 text-sm py-2 px-3 rounded-lg font-medium transition">
            Tambah
          </button>
          <button
            onClick={() => {
              disableEditing();
              emitInteraction('typing-end', `typing-${listId}`);
            }}
            type="button"
            className="p-2 text-zinc-400 hover:bg-zinc-700/50 rounded-lg transition"
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
        <div className="flex items-center gap-2 text-xs text-indigo-400 italic animate-pulse">
          <div className="w-4 h-4 rounded-full bg-indigo-600/30 flex items-center justify-center text-[8px] font-bold text-indigo-300">{activeUser.userName.charAt(0)}</div>
          {activeUser.userName} sedang mengetik...
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2 px-2">
      <button onClick={enableEditing} className="h-auto px-2 py-2 w-full justify-start text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 rounded-lg text-sm font-medium flex items-center gap-x-2 transition cursor-pointer">
        <Plus className="h-4 w-4" />
        Tambah Kartu
      </button>
    </div>
  );
};
