// test/actions/join-board.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockDb, mockBoard, mockBoardMember } from '../mocks/db';
import { mockSession } from '../mocks/auth';

vi.mock('@/lib/deps', () => ({
  defaultDeps: { db: {}, auth: vi.fn() },
}));

import { _joinBoard } from '@/actions/join-board';

const mockDb = createMockDb();
const mockAuth = vi.fn();
const mockDeps = { db: mockDb as any, auth: mockAuth };

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('joinBoard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue(mockSession);
  });

  describe('Authentication', () => {
    it('should return error when user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null);

      const formData = new FormData();
      formData.append('inviteCode', 'ABC123');

      const result = await _joinBoard(formData, mockDeps);

      expect(result).toEqual({ error: 'Anda harus login terlebih dahulu!' });
    });

    it('should return error when session has no user id', async () => {
      mockAuth.mockResolvedValue({ user: { email: 'test@example.com' } });

      const formData = new FormData();
      formData.append('inviteCode', 'ABC123');

      const result = await _joinBoard(formData, mockDeps);

      expect(result).toEqual({ error: 'Anda harus login terlebih dahulu!' });
    });
  });

  describe('Validation', () => {
    it('should return error when invite code is empty', async () => {
      const formData = new FormData();
      formData.append('inviteCode', '');

      const result = await _joinBoard(formData, mockDeps);

      expect(result).toEqual({ error: 'Kode undangan tidak valid!' });
    });

    it('should return error when invite code is too short', async () => {
      const formData = new FormData();
      formData.append('inviteCode', 'AB');

      const result = await _joinBoard(formData, mockDeps);

      expect(result).toEqual({ error: 'Kode undangan tidak valid!' });
    });

    it('should uppercase and trim invite code', async () => {
      mockDb.board.findFirst.mockResolvedValue(null);

      const formData = new FormData();
      formData.append('inviteCode', '  abc123  ');

      await _joinBoard(formData, mockDeps);

      expect(mockDb.board.findFirst).toHaveBeenCalledWith({
        where: { inviteCode: 'ABC123' },
        select: { id: true, title: true, userId: true },
      });
    });
  });

  describe('Board Finding', () => {
    it('should return error when board is not found', async () => {
      mockDb.board.findFirst.mockResolvedValue(null);

      const formData = new FormData();
      formData.append('inviteCode', 'NOTFND');

      const result = await _joinBoard(formData, mockDeps);

      expect(result).toEqual({ error: 'Board dengan kode tersebut tidak ditemukan!' });
    });

    it('should return error when user is the board owner', async () => {
      mockDb.board.findFirst.mockResolvedValue({
        ...mockBoard,
        userId: 'user-123',
      });

      const formData = new FormData();
      formData.append('inviteCode', 'ABC123');

      const result = await _joinBoard(formData, mockDeps);

      expect(result).toEqual({ error: 'Anda adalah pemilik board ini!' });
    });

    it('should return error when user is already a member', async () => {
      mockDb.board.findFirst.mockResolvedValue({
        ...mockBoard,
        userId: 'other-user',
      });
      mockDb.boardMember.findUnique.mockResolvedValue(mockBoardMember);

      const formData = new FormData();
      formData.append('inviteCode', 'ABC123');

      const result = await _joinBoard(formData, mockDeps);

      expect(result).toEqual({
        error: 'Anda sudah bergabung di board ini!',
        boardId: 'board-123',
      });
    });
  });

  describe('Joining Board', () => {
    it('should join board successfully', async () => {
      mockDb.board.findFirst.mockResolvedValue({
        id: 'board-123',
        title: 'Team Board',
        userId: 'other-user',
      });
      mockDb.boardMember.findUnique.mockResolvedValue(null);
      mockDb.boardMember.create.mockResolvedValue(mockBoardMember);

      const formData = new FormData();
      formData.append('inviteCode', 'ABC123');

      const result = await _joinBoard(formData, mockDeps);

      expect(result).toEqual({
        success: true,
        message: 'Berhasil bergabung ke board "Team Board"!',
        boardId: 'board-123',
      });

      expect(mockDb.boardMember.create).toHaveBeenCalledWith({
        data: {
          boardId: 'board-123',
          userId: 'user-123',
          role: 'member',
        },
      });
    });
  });
});
