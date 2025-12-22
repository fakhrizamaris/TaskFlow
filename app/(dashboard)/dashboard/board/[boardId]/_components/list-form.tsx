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
        <form ref={formRef} action={onSubmit} className="bg-white/80 p-3 rounded-md shadow-md space-y-3">
          <input
            ref={inputRef}
            name="title"
            className="text-sm w-full px-2 py-1.5 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-gray-500"
            placeholder="Beri nama list..."
            onKeyDown={(e) => {
              if (e.key === 'Escape') disableEditing();
            }}
          />
          <div className="flex items-center gap-x-1">
            <button type="submit" className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded font-medium hover:bg-blue-700 transition">
              Tambahkan List
            </button>
            <button type="button" onClick={disableEditing} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded">
              <X className="h-4 w-4" />
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="w-[272px] shrink-0 select-none">
      <button onClick={enableEditing} className="w-full rounded-md bg-white/50 hover:bg-white/80 transition p-3 flex items-center font-medium text-sm text-white hover:text-black cursor-pointer">
        <Plus className="h-4 w-4 mr-2" />
        Tambahkan List
      </button>
    </li>
  );
};
