// test/actions/create-card.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockDb, mockBoard, mockCard } from '../mocks/db';
import { mockSession } from '../mocks/auth';

vi.mock('@/lib/deps', () => ({
  defaultDeps: { db: {}, auth: vi.fn() },
}));

import { _createCard } from '@/actions/create-card';

const mockDb = createMockDb();
const mockAuth = vi.fn();
const mockDeps = { db: mockDb as any, auth: mockAuth };

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('createCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue(mockSession);
  });

  describe('Authentication & Authorization', () => {
    it('should return error when user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null);

      const formData = new FormData();
      formData.append('title', 'New Card');
      formData.append('listId', 'list-123');
      formData.append('boardId', 'board-123');

      const result = await _createCard(formData, mockDeps);

      expect(result).toEqual({ error: 'Data tidak lengkap' });
    });

    it('should return error when user does not own the board', async () => {
      mockDb.board.findUnique.mockResolvedValue(null);

      const formData = new FormData();
      formData.append('title', 'New Card');
      formData.append('listId', 'list-123');
      formData.append('boardId', 'board-123');

      const result = await _createCard(formData, mockDeps);

      expect(result).toEqual({ error: 'Unauthorized' });
    });
  });

  describe('Validation', () => {
    it('should return error when title is missing', async () => {
      const formData = new FormData();
      formData.append('listId', 'list-123');
      formData.append('boardId', 'board-123');

      const result = await _createCard(formData, mockDeps);

      expect(result).toEqual({ error: 'Data tidak lengkap' });
    });

    it('should return error when listId is missing', async () => {
      const formData = new FormData();
      formData.append('title', 'New Card');
      formData.append('boardId', 'board-123');

      const result = await _createCard(formData, mockDeps);

      expect(result).toEqual({ error: 'Data tidak lengkap' });
    });

    it('should return error when boardId is missing', async () => {
      const formData = new FormData();
      formData.append('title', 'New Card');
      formData.append('listId', 'list-123');

      const result = await _createCard(formData, mockDeps);

      expect(result).toEqual({ error: 'Data tidak lengkap' });
    });
  });

  describe('Card Creation', () => {
    it('should create card with order 1 when list is empty', async () => {
      mockDb.board.findUnique.mockResolvedValue(mockBoard);
      mockDb.card.findFirst.mockResolvedValue(null);
      mockDb.card.create.mockResolvedValue(mockCard);

      const formData = new FormData();
      formData.append('title', 'First Card');
      formData.append('listId', 'list-123');
      formData.append('boardId', 'board-123');

      const result = await _createCard(formData, mockDeps);

      expect(result).toEqual({ success: true });
      expect(mockDb.card.create).toHaveBeenCalledWith({
        data: {
          title: 'First Card',
          listId: 'list-123',
          order: 1,
          authorId: 'user-123',
        },
      });
    });

    it('should create card with incremented order', async () => {
      mockDb.board.findUnique.mockResolvedValue(mockBoard);
      mockDb.card.findFirst.mockResolvedValue({ order: 5 });
      mockDb.card.create.mockResolvedValue(mockCard);

      const formData = new FormData();
      formData.append('title', 'Sixth Card');
      formData.append('listId', 'list-123');
      formData.append('boardId', 'board-123');

      const result = await _createCard(formData, mockDeps);

      expect(result).toEqual({ success: true });
      expect(mockDb.card.create).toHaveBeenCalledWith({
        data: {
          title: 'Sixth Card',
          listId: 'list-123',
          order: 6,
          authorId: 'user-123',
        },
      });
    });
  });
});
