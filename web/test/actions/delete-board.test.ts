// test/actions/delete-board.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockDb, mockUser, mockBoard } from '../mocks/db';
import { mockSession } from '../mocks/auth';

vi.mock('@/lib/deps', () => ({
  defaultDeps: { db: {}, auth: vi.fn() },
}));

import { _deleteBoard } from '@/actions/delete-board';

const mockDb = createMockDb();
const mockAuth = vi.fn();
const mockDeps = { db: mockDb as any, auth: mockAuth };

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('deleteBoard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue(mockSession);
  });

  describe('Authentication', () => {
    it('should return error when user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null);

      const result = await _deleteBoard('board-123', mockDeps);

      expect(result).toEqual({ error: 'Unauthorized' });
      expect(mockDb.board.delete).not.toHaveBeenCalled();
    });

    it('should return error when session has no email', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-123' } });

      const result = await _deleteBoard('board-123', mockDeps);

      expect(result).toEqual({ error: 'Unauthorized' });
    });
  });

  describe('Authorization', () => {
    it('should return error when user is not found', async () => {
      mockDb.user.findUnique.mockResolvedValue(null);

      const result = await _deleteBoard('board-123', mockDeps);

      expect(result).toEqual({ error: 'User tidak ditemukan' });
    });

    it('should return error when board is not found', async () => {
      mockDb.user.findUnique.mockResolvedValue(mockUser);
      mockDb.board.findUnique.mockResolvedValue(null);

      const result = await _deleteBoard('board-123', mockDeps);

      expect(result).toEqual({ error: 'Board tidak ditemukan' });
    });

    it('should return error when user is not the board owner', async () => {
      mockDb.user.findUnique.mockResolvedValue(mockUser);
      mockDb.board.findUnique.mockResolvedValue({
        ...mockBoard,
        userId: 'other-user-id',
        lists: [],
        members: [],
      });

      const result = await _deleteBoard('board-123', mockDeps);

      expect(result).toEqual({ error: 'Hanya pemilik board yang dapat menghapus board ini' });
    });
  });

  describe('Deletion', () => {
    it('should delete board successfully', async () => {
      mockDb.user.findUnique.mockResolvedValue(mockUser);
      mockDb.board.findUnique.mockResolvedValue({
        ...mockBoard,
        lists: [
          { id: 'list-1', cards: [{ id: 'card-1' }, { id: 'card-2' }] },
          { id: 'list-2', cards: [{ id: 'card-3' }] },
        ],
        members: [{ id: 'member-1' }],
      });
      mockDb.board.delete.mockResolvedValue(mockBoard);

      const result = await _deleteBoard('board-123', mockDeps);

      expect(result).toEqual({
        success: true,
        message: `Board "${mockBoard.title}" berhasil dihapus`,
        stats: { listCount: 2, cardCount: 3, memberCount: 1 },
        shouldRedirect: true,
      });
      expect(mockDb.board.delete).toHaveBeenCalledWith({
        where: { id: 'board-123' },
      });
    });

    it('should handle deletion error gracefully', async () => {
      mockDb.user.findUnique.mockResolvedValue(mockUser);
      mockDb.board.findUnique.mockResolvedValue({
        ...mockBoard,
        lists: [],
        members: [],
      });
      mockDb.board.delete.mockRejectedValue(new Error('Database error'));

      const result = await _deleteBoard('board-123', mockDeps);

      expect(result).toEqual({ error: 'Gagal menghapus board' });
    });
  });
});
