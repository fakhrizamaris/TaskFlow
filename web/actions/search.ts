// actions/search.ts
'use server';

import { defaultDeps, type Dependencies } from '@/lib/deps';

export async function searchDashboard(query: string, deps: Dependencies = defaultDeps) {
  const session = await deps.auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };

  if (!query || query.length < 2) return { boards: [], cards: [] };

  const userId = session.user.id;

  try {
    const [boards, cards] = await Promise.all([
      // Search Boards
      deps.db.board.findMany({
        where: {
          OR: [{ userId: userId }, { members: { some: { userId: userId } } }],
          title: { contains: query, mode: 'insensitive' },
        },
        select: {
          id: true,
          title: true,
          updatedAt: true,
        },
        take: 5,
      }),

      // Search Cards
      deps.db.card.findMany({
        where: {
          list: {
            board: {
              OR: [{ userId: userId }, { members: { some: { userId: userId } } }],
            },
          },
          title: { contains: query, mode: 'insensitive' },
        },
        select: {
          id: true,
          title: true,
          list: {
            select: {
              board: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
        take: 5,
      }),
    ]);

    return { boards, cards };
  } catch (error) {
    console.error('Search error:', error);
    return { error: 'Failed to search' };
  }
}
