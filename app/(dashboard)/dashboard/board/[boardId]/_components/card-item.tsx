// web/app/(dashboard)/board/[boardId]/_components/card-item.tsx
'use client';

import { Card } from '@prisma/client';

interface CardItemProps {
  data: Card;
}

export const CardItem = ({ data }: CardItemProps) => {
  return <div className="truncate border-2 border-transparent hover:border-black/10 py-2 px-3 text-sm bg-white rounded-md shadow-sm cursor-pointer hover:shadow-md transition-all text-gray-700 font-medium">{data.title}</div>;
};
