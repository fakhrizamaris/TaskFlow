// test/actions/create-list.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockDb, mockBoard, mockList } from '../mocks/db';
import { mockSession } from '../mocks/auth';

// Mock the deps module BEFORE importing the action
vi.mock('@/lib/deps', () => ({
  defaultDeps: { db: {}, auth: vi.fn() },
}));

import { _createList } from '@/actions/create-list';

const mockDb = createMockDb();
const mockAuth = vi.fn();
const mockDeps = { db: mockDb as any, auth: mockAuth };

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('createList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue(mockSession);
  });

  describe('Authentication & Authorization', () => {
    it('should return error when user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null);

      const formData = new FormData();
      formData.append('boardId', 'board-123');
      formData.append('title', 'New List');

      const result = await _createList(formData, mockDeps);

      expect(result).toEqual({ error: 'Data tidak lengkap' });
    });

    it('should return error when user does not own the board', async () => {
      mockDb.board.findUnique.mockResolvedValue(null);

      const formData = new FormData();
      formData.append('boardId', 'board-123');
      formData.append('title', 'New List');

      const result = await _createList(formData, mockDeps);

      expect(result).toEqual({ error: 'Unauthorized' });
    });
  });

  describe('Validation', () => {
    it('should return error when boardId is missing', async () => {
      const formData = new FormData();
      formData.append('title', 'New List');

      const result = await _createList(formData, mockDeps);

      expect(result).toEqual({ error: 'Data tidak lengkap' });
    });

    it('should return error when title is missing', async () => {
      const formData = new FormData();
      formData.append('boardId', 'board-123');

      const result = await _createList(formData, mockDeps);

      expect(result).toEqual({ error: 'Data tidak lengkap' });
    });
  });

  describe('List Creation', () => {
    it('should create list with order 1 when board is empty', async () => {
      mockDb.board.findUnique.mockResolvedValue(mockBoard);
      mockDb.list.findFirst.mockResolvedValue(null);
      mockDb.list.create.mockResolvedValue(mockList);

      const formData = new FormData();
      formData.append('boardId', 'board-123');
      formData.append('title', 'First List');

      const result = await _createList(formData, mockDeps);

      expect(result).toEqual({ success: true });
      expect(mockDb.list.create).toHaveBeenCalledWith({
        data: {
          title: 'First List',
          boardId: 'board-123',
          order: 1,
        },
      });
    });

    it('should create list with incremented order', async () => {
      mockDb.board.findUnique.mockResolvedValue(mockBoard);
      mockDb.list.findFirst.mockResolvedValue({ order: 3 });
      mockDb.list.create.mockResolvedValue(mockList);

      const formData = new FormData();
      formData.append('boardId', 'board-123');
      formData.append('title', 'Fourth List');

      const result = await _createList(formData, mockDeps);

      expect(result).toEqual({ success: true });
      expect(mockDb.list.create).toHaveBeenCalledWith({
        data: {
          title: 'Fourth List',
          boardId: 'board-123',
          order: 4,
        },
      });
    });
  });
});
