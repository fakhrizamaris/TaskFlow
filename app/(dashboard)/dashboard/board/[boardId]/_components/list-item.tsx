// web/app/(dashboard)/board/[boardId]/_components/list-item.tsx
'use client';

import { useState } from 'react';
import { List, Card } from '@prisma/client';
import { CardItem } from './card-item';
import { CardForm } from './card-form';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { GripVertical, MoreHorizontal } from 'lucide-react';

interface ListItemProps {
  data: List & { cards: Card[] };
  index: number;
}

export const ListItem = ({ data, index }: ListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li {...provided.draggableProps} ref={provided.innerRef} className="h-full w-[272px] shrink-0 select-none">
          <div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
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
