// test/mocks/db.ts
import { vi } from 'vitest';

// Mock data
export const mockUser = {
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedpassword',
  image: null,
  tutorialCompleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockBoard = {
  id: 'board-123',
  title: 'Test Board',
  userId: 'user-123',
  inviteCode: 'ABC123',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockPrivateBoard = {
  id: 'board-456',
  title: 'Private Board',
  userId: 'user-123',
  inviteCode: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockList = {
  id: 'list-123',
  title: 'Test List',
  order: 1,
  boardId: 'board-123',
  board: mockBoard,
};

export const mockCard = {
  id: 'card-123',
  title: 'Test Card',
  description: 'Test description',
  order: 1,
  status: 'TODO' as const,
  dueDate: null,
  listId: 'list-123',
  authorId: 'user-123',
  createdAt: new Date(),
  updatedAt: new Date(),
  list: mockList,
};

export const mockBoardMember = {
  id: 'member-123',
  boardId: 'board-123',
  userId: 'user-456',
  role: 'member',
  joinedAt: new Date(),
};

// Create mock Prisma client
export const createMockDb = () => ({
  user: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  board: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  list: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  card: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  boardMember: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
});

export type MockDb = ReturnType<typeof createMockDb>;
