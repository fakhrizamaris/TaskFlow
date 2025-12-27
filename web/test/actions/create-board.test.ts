// test/actions/create-board.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockDb, mockBoard } from '../mocks/db';
import { mockSession } from '../mocks/auth';

// Mock the deps module BEFORE importing the action
vi.mock('@/lib/deps', () => ({
  defaultDeps: {
    db: {},
    auth: vi.fn(),
  },
}));

// Now import the action
import { _createBoard } from '@/actions/create-board';

// Create our own mock deps for testing
const mockDb = createMockDb();
const mockAuth = vi.fn();
const mockDeps = { db: mockDb as any, auth: mockAuth };

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('createBoard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue(mockSession);
  });

  describe('Authentication', () => {
    it('should return error when user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null);

      const formData = new FormData();
      formData.append('title', 'New Board');
      formData.append('type', 'private');

      const result = await _createBoard(formData, mockDeps);

      expect(result).toEqual({ error: 'Unauthorized' });
      expect(mockDb.board.create).not.toHaveBeenCalled();
    });

    it('should return error when session has no user id', async () => {
      mockAuth.mockResolvedValue({ user: { email: 'test@example.com' } });

      const formData = new FormData();
      formData.append('title', 'New Board');
      formData.append('type', 'private');

      const result = await _createBoard(formData, mockDeps);

      expect(result).toEqual({ error: 'Unauthorized' });
    });
  });

  describe('Validation', () => {
    it('should return error when title is empty', async () => {
      const formData = new FormData();
      formData.append('title', '');
      formData.append('type', 'private');

      const result = await _createBoard(formData, mockDeps);

      expect(result).toEqual({ error: 'Judul board minimal 3 huruf!' });
      expect(mockDb.board.create).not.toHaveBeenCalled();
    });

    it('should return error when title is less than 3 characters', async () => {
      const formData = new FormData();
      formData.append('title', 'AB');
      formData.append('type', 'private');

      const result = await _createBoard(formData, mockDeps);

      expect(result).toEqual({ error: 'Judul board minimal 3 huruf!' });
    });
  });

  describe('Private Board Creation', () => {
    it('should create private board without invite code', async () => {
      mockDb.board.create.mockResolvedValue(mockBoard);

      const formData = new FormData();
      formData.append('title', 'My Private Board');
      formData.append('type', 'private');

      const result = await _createBoard(formData, mockDeps);

      expect(result).toEqual({ success: true });
      expect(mockDb.board.create).toHaveBeenCalledWith({
        data: {
          title: 'My Private Board',
          userId: 'user-123',
          inviteCode: null,
        },
      });
    });
  });

  describe('Public Board Creation', () => {
    it('should create public board with invite code', async () => {
      mockDb.board.create.mockResolvedValue(mockBoard);

      const formData = new FormData();
      formData.append('title', 'My Public Board');
      formData.append('type', 'public');

      const result = await _createBoard(formData, mockDeps);

      expect(result).toEqual({ success: true });
      expect(mockDb.board.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: 'My Public Board',
          userId: 'user-123',
          inviteCode: expect.any(String),
        }),
      });

      // Check invite code format (6 uppercase characters)
      const createCall = mockDb.board.create.mock.calls[0][0];
      expect(createCall.data.inviteCode).toMatch(/^[A-Z0-9]{6}$/);
    });
  });
});
