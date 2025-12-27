// test/actions/invite-member.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockDb, mockUser, mockBoard, mockBoardMember } from '../mocks/db';
import { mockSession } from '../mocks/auth';

vi.mock('@/lib/deps', () => ({
  defaultDeps: { db: {}, auth: vi.fn() },
}));

import { _inviteMember } from '@/actions/invite-member';

const mockDb = createMockDb();
const mockAuth = vi.fn();
const mockDeps = { db: mockDb as any, auth: mockAuth };

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('inviteMember', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue(mockSession);
  });

  describe('Authentication', () => {
    it('should return error when user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null);

      const formData = new FormData();
      formData.append('email', 'invite@example.com');
      formData.append('boardId', 'board-123');

      const result = await _inviteMember(formData, mockDeps);

      expect(result).toEqual({ error: 'Unauthorized' });
    });
  });

  describe('User Finding', () => {
    it('should return error when user to invite is not found', async () => {
      mockDb.user.findUnique.mockResolvedValue(null);

      const formData = new FormData();
      formData.append('email', 'notfound@example.com');
      formData.append('boardId', 'board-123');

      const result = await _inviteMember(formData, mockDeps);

      expect(result).toEqual({ error: 'User dengan email tersebut tidak ditemukan!' });
    });

    it('should return error when user is already a member', async () => {
      const invitedUser = { ...mockUser, id: 'invited-user-id', email: 'member@example.com' };
      mockDb.user.findUnique.mockResolvedValue(invitedUser);
      mockDb.boardMember.findUnique.mockResolvedValue(mockBoardMember);

      const formData = new FormData();
      formData.append('email', 'member@example.com');
      formData.append('boardId', 'board-123');

      const result = await _inviteMember(formData, mockDeps);

      expect(result).toEqual({ error: 'User ini sudah ada di dalam board!' });
    });

    it('should return error when user to invite is the board owner', async () => {
      const ownerUser = { ...mockUser, id: 'owner-id', name: 'Owner' };
      mockDb.user.findUnique.mockResolvedValue(ownerUser);
      mockDb.boardMember.findUnique.mockResolvedValue(null);
      mockDb.board.findUnique.mockResolvedValue({
        ...mockBoard,
        userId: 'owner-id',
      });

      const formData = new FormData();
      formData.append('email', 'owner@example.com');
      formData.append('boardId', 'board-123');

      const result = await _inviteMember(formData, mockDeps);

      expect(result).toEqual({ error: 'User ini adalah pemilik board!' });
    });
  });

  describe('Invitation', () => {
    it('should invite member successfully', async () => {
      const invitedUser = { ...mockUser, id: 'invited-user-id', name: 'John Doe' };
      mockDb.user.findUnique.mockResolvedValue(invitedUser);
      mockDb.boardMember.findUnique.mockResolvedValue(null);
      mockDb.board.findUnique.mockResolvedValue({
        ...mockBoard,
        userId: 'different-owner',
      });
      mockDb.boardMember.create.mockResolvedValue(mockBoardMember);

      const formData = new FormData();
      formData.append('email', 'john@example.com');
      formData.append('boardId', 'board-123');

      const result = await _inviteMember(formData, mockDeps);

      expect(result).toEqual({ success: 'Berhasil mengundang John Doe' });
      expect(mockDb.boardMember.create).toHaveBeenCalledWith({
        data: {
          boardId: 'board-123',
          userId: 'invited-user-id',
          role: 'member',
        },
      });
    });
  });
});
