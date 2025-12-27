'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { List, Card } from '@prisma/client';
import { CardItem } from './card-item';
import { CardForm } from './card-form';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { GripVertical, MoreHorizontal, Trash2, X, Loader2, AlertTriangle } from 'lucide-react';
import { deleteList } from '@/actions/delete-list';
import { useRouter } from 'next/navigation';

import { useBoardSocketContext } from '@/providers/board-socket-provider';

type CardStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
type CardWithStatus = Card & { status?: CardStatus; dueDate?: Date | string | null };

interface ListItemProps {
  data: List & { cards: CardWithStatus[] };
  index: number;
}

export const ListItem = ({ data, index }: ListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Realtime Interactions
  const { emitInteraction, activeInteractions } = useBoardSocketContext();

  // Check if someone else is hovering this list
  const activeUser = activeInteractions[data.id];
  const isHoveredByOther = activeUser && activeUser.type === 'hover-list';

  const onMouseEnter = () => {
    emitInteraction('hover-list', data.id);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDeleteList = async () => {
    setIsDeleting(true);

    const result = await deleteList(data.id);

    if (result.error) {
      alert(result.error);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(false);
      router.refresh();
    }
  };

  // Delete Confirmation Modal using Portal
  const DeleteModal =
    mounted && showDeleteConfirm
      ? createPortal(
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
            {/* Solid dark backdrop */}
            <div className="absolute inset-0 bg-black/90" />

            {/* Modal Content */}
            <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
              {/* Close button */}
              <button onClick={() => setShowDeleteConfirm(false)} className="absolute top-4 right-4 p-1 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-lg transition-all">
                <X className="h-5 w-5" />
              </button>

              {/* Content */}
              <div className="text-center">
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-5">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-zinc-100 mb-2">Hapus List?</h3>

                {/* Description */}
                <p className="text-sm text-zinc-400 mb-2">
                  List <span className="font-semibold text-zinc-200">"{data.title}"</span> akan dihapus.
                </p>
                {data.cards.length > 0 && (
                  <p className="text-sm text-amber-400 mb-4 flex items-center justify-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    {data.cards.length} card di dalam list ini juga akan dihapus!
                  </p>
                )}

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-3 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-all">
                    Batal
                  </button>
                  <button
                    onClick={handleDeleteList}
                    disabled={isDeleting}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Menghapus...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        <span>Hapus</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <Draggable draggableId={data.id} index={index}>
        {(provided) => (
          <li {...provided.draggableProps} ref={provided.innerRef} className="h-full w-[272px] shrink-0 select-none relative" onMouseEnter={onMouseEnter}>
            {/* Visual Indicator for Remote Hover */}
            {isHoveredByOther && (
              <div className="absolute -top-10 left-0 bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg z-50 flex items-center gap-1.5 animate-in fade-in zoom-in duration-200 border border-indigo-400/30">
                {activeUser.userImage ? (
                  <img src={activeUser.userImage} className="w-4 h-4 rounded-full" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[8px] font-bold">{activeUser.userName.charAt(0)}</div>
                )}
                {activeUser.userName} melihat ini
              </div>
            )}

            <div
              className={`w-full rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 shadow-lg pb-2 transition-colors duration-300 ${isHoveredByOther ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-transparent' : ''}`}
            >
              {/* Header List (Drag Handle) */}
              <div {...provided.dragHandleProps} className="pt-3 px-3 text-sm font-semibold flex justify-between items-center gap-x-2 cursor-grab active:cursor-grabbing">
                <div className="flex items-center gap-x-2">
                  <GripVertical className="h-4 w-4 text-zinc-500" />
                  <div className="px-1.5 py-1 text-sm font-semibold text-zinc-200">{data.title}</div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-zinc-500 bg-zinc-700/50 px-2 py-0.5 rounded">{data.cards.length}</span>
                    {data.cards.filter((c: CardWithStatus) => c.status === 'DONE').length > 0 && (
                      <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">✓ {data.cards.filter((c: CardWithStatus) => c.status === 'DONE').length}</span>
                    )}
                  </div>
                </div>

                {/* Menu Button */}
                <div className="relative">
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1.5 hover:bg-zinc-700/50 rounded-lg transition">
                    <MoreHorizontal className="h-4 w-4 text-zinc-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-1 z-50 w-40 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                        <div className="p-1">
                          <button
                            onClick={() => {
                              setIsMenuOpen(false);
                              setShowDeleteConfirm(true);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Hapus List</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Area Drop untuk Cards (Droppable) */}
              <Droppable droppableId={data.id} type="card">
                {(provided) => (
                  <ol ref={provided.innerRef} {...provided.droppableProps} className="mx-1 px-1 py-0.5 flex flex-col gap-y-2 mt-2 min-h-[2px]">
                    {data.cards.map((card, index) => (
                      <CardItem key={card.id} data={card} index={index} />
                    ))}
                    {provided.placeholder}
                  </ol>
                )}
              </Droppable>

              {/* Form Tambah Kartu */}
              <CardForm listId={data.id} isEditing={isEditing} enableEditing={() => setIsEditing(true)} disableEditing={() => setIsEditing(false)} />
            </div>
          </li>
        )}
      </Draggable>

      {/* Delete Modal rendered via Portal */}
      {DeleteModal}
    </>
  );
};
