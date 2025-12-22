// web/app/(dashboard)/board/[boardId]/_components/list-container.tsx
'use client';

import { useState, useEffect } from 'react';
import { List, Card } from '@prisma/client';
import { ListItem } from './list-item';
import { ListForm } from './list-form';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { updateListOrder } from '@/actions/update-list-order';
import { updateCardOrder } from '@/actions/update-card-order';
import { useBoardSocketContext } from '@/providers/board-socket-provider';

type ListWithCards = List & { cards: Card[] };

interface ListContainerProps {
  boardId: string;
  data: ListWithCards[];
}

// Helper: Reorder items dalam array
function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export const ListContainer = ({ boardId, data }: ListContainerProps) => {
  const { emitBoardUpdate, emitInteraction, activeInteractions } = useBoardSocketContext();

  // State lokal untuk optimistic update (langsung update UI sebelum server response)
  const [orderedData, setOrderedData] = useState(data);

  // Sync state ketika data dari server berubah
  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    // Jika tidak ada tujuan (drop di luar area) -> abaikan
    if (!destination) return;

    // Jika posisi tidak berubah -> abaikan
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // === DRAG LIST (Horizontal) ===
    if (type === 'list') {
      const newLists = reorder(orderedData, source.index, destination.index).map((item, idx) => ({ ...item, order: idx }));

      setOrderedData(newLists); // Optimistic update

      // Simpan ke database
      updateListOrder(
        newLists.map((list) => ({
          id: list.id,
          order: list.order,
          boardId: boardId,
        }))
      );
    }

    // === DRAG CARD (Vertikal / Antar List) ===
    if (type === 'card') {
      const newOrderedData = [...orderedData];

      // Cari list asal dan tujuan
      const sourceList = newOrderedData.find((list) => list.id === source.droppableId);
      const destList = newOrderedData.find((list) => list.id === destination.droppableId);

      if (!sourceList || !destList) return;

      // Pastikan cards tidak undefined
      if (!sourceList.cards) sourceList.cards = [];
      if (!destList.cards) destList.cards = [];

      // === PINDAH DALAM LIST YANG SAMA ===
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(sourceList.cards, source.index, destination.index);
        reorderedCards.forEach((card, idx) => {
          card.order = idx;
        });
        sourceList.cards = reorderedCards;

        setOrderedData(newOrderedData);

        // Simpan ke database
        updateCardOrder(
          reorderedCards.map((card) => ({
            id: card.id,
            order: card.order,
            listId: sourceList.id,
            boardId: boardId,
          }))
        );
      } else {
        // === PINDAH KE LIST BERBEDA ===
        // 1. Hapus dari list asal
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // 2. Assign listId baru
        movedCard.listId = destination.droppableId;

        // 3. Sisipkan ke list tujuan
        destList.cards.splice(destination.index, 0, movedCard);

        // 4. Update order untuk kedua list
        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });
        destList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        setOrderedData(newOrderedData);

        // Simpan ke database (semua kartu yang berubah)
        updateCardOrder([
          ...sourceList.cards.map((card) => ({
            id: card.id,
            order: card.order,
            listId: sourceList.id,
            boardId: boardId,
          })),
          ...destList.cards.map((card) => ({
            id: card.id,
            order: card.order,
            listId: destList.id,
            boardId: boardId,
          })),
        ]);
      }
    }

    // ✅ Emit update ke user lain melalui socket
    emitBoardUpdate('Ada yang geser kartu!');
    emitInteraction('drag-end', 'board');
  };

  const onDragStart = () => {
    emitInteraction('drag-start', 'board');
  };

  const isDragByOther = activeInteractions['board'] && activeInteractions['board'].type === 'drag-start';

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      {isDragByOther && <div className="fixed bottom-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce">✋ {activeInteractions['board'].userName} sedang memindahkan kartu...</div>}
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol {...provided.droppableProps} ref={provided.innerRef} className="flex gap-x-3 h-full items-start">
            {orderedData.map((list, index) => (
              <ListItem key={list.id} index={index} data={list} />
            ))}
            {provided.placeholder}

            {/* Form Tambah List Baru */}
            <ListForm boardId={boardId} />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
