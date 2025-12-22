// web/app/(dashboard)/board/[boardId]/_components/list-item.tsx
'use client';

import { useState } from 'react';
import { List, Card } from '@prisma/client';
import { CardItem } from './card-item';
import { CardForm } from './card-form';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { GripVertical, MoreHorizontal } from 'lucide-react';

import { useBoardSocketContext } from '@/providers/board-socket-provider';

interface ListItemProps {
  data: List & { cards: Card[] };
  index: number;
}

export const ListItem = ({ data, index }: ListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  // Realtime Interactions
  const { emitInteraction, activeInteractions } = useBoardSocketContext();

  // Check if someone else is hovering this list
  const activeUser = activeInteractions[data.id];
  const isHoveredByOther = activeUser && activeUser.type === 'hover-list';

  const onMouseEnter = () => {
    emitInteraction('hover-list', data.id);
  };

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li {...provided.draggableProps} ref={provided.innerRef} className="h-full w-[272px] shrink-0 select-none relative" onMouseEnter={onMouseEnter}>
          {/* Visual Indicator for Remote Hover */}
          {isHoveredByOther && (
            <div className="absolute -top-10 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow-md z-50 flex items-center gap-1 animate-in fade-in zoom-in duration-200">
              {activeUser.userImage ? (
                <img src={activeUser.userImage} className="w-4 h-4 rounded-full" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[8px] font-bold">{activeUser.userName.charAt(0)}</div>
              )}
              {activeUser.userName} melihat ini
            </div>
          )}

          <div className={`w-full rounded-md bg-[#f1f2f4] shadow-md pb-2 transition-colors duration-300 ${isHoveredByOther ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
            {/* Header List (Drag Handle) */}
            <div {...provided.dragHandleProps} className="pt-2 px-2 text-sm font-semibold flex justify-between items-center gap-x-2 cursor-grab active:cursor-grabbing">
              <div className="flex items-center gap-x-1">
                <GripVertical className="h-4 w-4 text-gray-400" />
                <div className="border-transparent px-1.5 py-1 text-sm font-medium text-black truncate">{data.title}</div>
              </div>
              <button className="p-1 hover:bg-gray-200 rounded transition">
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </button>
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
  );
};
