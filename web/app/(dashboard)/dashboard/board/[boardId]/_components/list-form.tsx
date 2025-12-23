// web/app/(dashboard)/board/[boardId]/_components/list-form.tsx
'use client';

import { useState, useRef, ElementRef } from 'react';
import { Plus, X } from 'lucide-react';
import { createList } from '@/actions/create-list';
import { useRouter } from 'next/navigation';
import { useBoardSocketContext } from '@/providers/board-socket-provider';

interface ListFormProps {
  boardId: string;
}

export const ListForm = ({ boardId }: ListFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<ElementRef<'form'>>(null);
  const inputRef = useRef<ElementRef<'input'>>(null);
  const { emitBoardUpdate } = useBoardSocketContext();

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onSubmit = async (formData: FormData) => {
    formData.append('boardId', boardId);
    await createList(formData);
    disableEditing();
    router.refresh();

    // ✅ Notify user lain bahwa ada list baru
    emitBoardUpdate('List baru ditambahkan');
  };

  if (isEditing) {
    return (
      <li className="w-[272px] shrink-0 select-none">
        <form ref={formRef} action={onSubmit} className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 p-3 rounded-xl shadow-lg space-y-3">
          <input
            ref={inputRef}
            name="title"
            className="text-sm w-full px-3 py-2 rounded-lg border border-zinc-600/50 bg-zinc-900/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-zinc-200 placeholder:text-zinc-500"
            placeholder="Beri nama list..."
            onKeyDown={(e) => {
              if (e.key === 'Escape') disableEditing();
            }}
          />
          <div className="flex items-center gap-x-2">
            <button type="submit" className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
              Tambahkan List
            </button>
            <button type="button" onClick={disableEditing} className="p-2 text-zinc-400 hover:bg-zinc-700/50 rounded-lg transition">
              <X className="h-4 w-4" />
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="w-[272px] shrink-0 select-none">
      <button
        onClick={enableEditing}
        className="w-full rounded-xl bg-zinc-800/30 hover:bg-zinc-800/50 border border-dashed border-zinc-700/50 hover:border-zinc-600/50 transition p-3 flex items-center font-medium text-sm text-zinc-400 hover:text-zinc-200 cursor-pointer backdrop-blur-sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Tambahkan List
      </button>
    </li>
  );
};
