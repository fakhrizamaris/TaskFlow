// test/actions/delete-list.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockDb, mockUser, mockList, mockBoard } from '../mocks/db';
import { mockSession } from '../mocks/auth';

vi.mock('@/lib/deps', () => ({
  defaultDeps: { db: {}, auth: vi.fn() },
}));

import { _deleteList } from '@/actions/delete-list';

const mockDb = createMockDb();
const mockAuth = vi.fn();
const mockDeps = { db: mockDb as any, auth: mockAuth };

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('deleteList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue(mockSession);
  });

  describe('Authentication', () => {
    it('should return error when user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null);

      const result = await _deleteList('list-123', mockDeps);

      expect(result).toEqual({ error: 'Unauthorized' });
    });

    it('should return error when session has no email', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-123' } });

      const result = await _deleteList('list-123', mockDeps);

      expect(result).toEqual({ error: 'Unauthorized' });
    });
  });

  describe('Authorization', () => {
    it('should return error when list is not found', async () => {
      mockDb.list.findUnique.mockResolvedValue(null);

      const result = await _deleteList('list-123', mockDeps);

      expect(result).toEqual({ error: 'List tidak ditemukan' });
    });

    it('should return error when user is not owner or admin', async () => {
      mockDb.list.findUnique.mockResolvedValue({
        ...mockList,
        board: { ...mockBoard, userId: 'other-user' },
        cards: [],
      });
      mockDb.user.findUnique.mockResolvedValue(mockUser);
      mockDb.boardMember.findUnique.mockResolvedValue(null);

      const result = await _deleteList('list-123', mockDeps);

      expect(result).toEqual({ error: 'Anda tidak memiliki izin untuk menghapus list ini' });
    });

    it('should allow admin member to delete list', async () => {
      mockDb.list.findUnique.mockResolvedValue({
        ...mockList,
        board: { ...mockBoard, id: 'board-123', userId: 'other-user' },
        cards: [],
      });
      mockDb.user.findUnique.mockResolvedValue(mockUser);
      mockDb.boardMember.findUnique.mockResolvedValue({ role: 'admin' });
      mockDb.list.delete.mockResolvedValue(mockList);

      const result = await _deleteList('list-123', mockDeps);

      expect(result.success).toBe(true);
    });
  });

  describe('Deletion', () => {
    it('should delete list successfully', async () => {
      mockDb.list.findUnique.mockResolvedValue({
        ...mockList,
        title: 'My List',
        board: mockBoard,
        cards: [{ id: 'card-1' }, { id: 'card-2' }],
      });
      mockDb.user.findUnique.mockResolvedValue(mockUser);
      mockDb.list.delete.mockResolvedValue(mockList);

      const result = await _deleteList('list-123', mockDeps);

      expect(result).toEqual({
        success: true,
        message: 'List "My List" dan 2 card berhasil dihapus',
      });
      expect(mockDb.list.delete).toHaveBeenCalledWith({
        where: { id: 'list-123' },
      });
    });

    it('should handle deletion error gracefully', async () => {
      mockDb.list.findUnique.mockResolvedValue({
        ...mockList,
        board: mockBoard,
        cards: [],
      });
      mockDb.user.findUnique.mockResolvedValue(mockUser);
      mockDb.list.delete.mockRejectedValue(new Error('Database error'));

      const result = await _deleteList('list-123', mockDeps);

      expect(result).toEqual({ error: 'Gagal menghapus list' });
    });
  });
});
