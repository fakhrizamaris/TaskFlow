// web/app/(dashboard)/board/[boardId]/_components/list-item.tsx
'use client';

import { useState } from 'react';
import { List, Card } from '@prisma/client';
import { CardItem } from './card-item';
import { CardForm } from './card-form';

interface ListItemProps {
  data: List & { cards: Card[] }; // Tipe data gabungan List + Cards
}

export const ListItem = ({ data }: ListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <li className="h-full w-[272px] shrink-0 select-none">
      <div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
        {/* Header List */}
        <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-center gap-x-2">
          <div className="w-full border-transparent px-2.5 py-1 text-sm font-medium text-black truncate">{data.title}</div>
        </div>

        {/* Daftar Kartu (Area Looping) */}
        <ol className="mx-1 px-1 py-0.5 flex flex-col gap-y-2 mt-2">
          {data.cards.map((card) => (
            <CardItem key={card.id} data={card} />
          ))}
        </ol>

        {/* Form Tambah Kartu */}
        <CardForm listId={data.id} isEditing={isEditing} enableEditing={() => setIsEditing(true)} disableEditing={() => setIsEditing(false)} />
      </div>
    </li>
  );
};
