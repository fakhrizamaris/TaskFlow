// web/app/(dashboard)/board/[boardId]/_components/card-item.tsx
'use client';

import { Card } from '@prisma/client';
import { Draggable } from '@hello-pangea/dnd';

interface CardItemProps {
  data: Card;
  index: number;
}

export const CardItem = ({ data, index }: CardItemProps) => {
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={`
            truncate border border-zinc-700/50 py-3 px-4 text-sm 
            bg-zinc-900/80 rounded-lg shadow-sm cursor-grab active:cursor-grabbing
            text-zinc-300 font-medium
            hover:border-indigo-500/50 hover:shadow-md transition-all
            ${snapshot.isDragging ? 'rotate-2 shadow-xl ring-2 ring-indigo-500/50 bg-zinc-800' : ''}
          `}
        >
          {data.title}
        </div>
      )}
    </Draggable>
  );
};
