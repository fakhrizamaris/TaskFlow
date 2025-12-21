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
            truncate border-2 border-transparent py-2 px-3 text-sm 
            bg-white rounded-md shadow-sm cursor-grab active:cursor-grabbing
            text-gray-700 font-medium
            hover:border-blue-400 hover:shadow-md transition-all
            ${snapshot.isDragging ? 'rotate-2 shadow-lg ring-2 ring-blue-400' : ''}
          `}
        >
          {data.title}
        </div>
      )}
    </Draggable>
  );
};
