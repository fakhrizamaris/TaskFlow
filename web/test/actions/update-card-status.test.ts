// test/actions/update-card-status.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockDb, mockCard } from '../mocks/db';
import { mockSession } from '../mocks/auth';

vi.mock('@/lib/deps', () => ({
  defaultDeps: { db: {}, auth: vi.fn() },
}));

import { _updateCardStatus } from '@/actions/update-card-status';

const mockDb = createMockDb();
const mockAuth = vi.fn();
const mockDeps = { db: mockDb as any, auth: mockAuth };

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('updateCardStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue(mockSession);
  });

  describe('Authentication', () => {
    it('should return error when user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null);

      const result = await _updateCardStatus('card-123', 'DONE', mockDeps);

      expect(result).toEqual({ error: 'Unauthorized' });
    });

    it('should return error when session has no email', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-123' } });

      const result = await _updateCardStatus('card-123', 'DONE', mockDeps);

      expect(result).toEqual({ error: 'Unauthorized' });
    });
  });

  describe('Card Finding', () => {
    it('should return error when card is not found', async () => {
      mockDb.card.findUnique.mockResolvedValue(null);

      const result = await _updateCardStatus('nonexistent-card', 'DONE', mockDeps);

      expect(result).toEqual({ error: 'Card tidak ditemukan' });
    });
  });

  describe('Status Update', () => {
    it('should update status to TODO', async () => {
      mockDb.card.findUnique.mockResolvedValue(mockCard);
      mockDb.card.update.mockResolvedValue({ ...mockCard, status: 'TODO' });

      const result = await _updateCardStatus('card-123', 'TODO', mockDeps);

      expect(result).toEqual({ success: true, status: 'TODO' });
      expect(mockDb.card.update).toHaveBeenCalledWith({
        where: { id: 'card-123' },
        data: { status: 'TODO' },
      });
    });

    it('should update status to IN_PROGRESS', async () => {
      mockDb.card.findUnique.mockResolvedValue(mockCard);
      mockDb.card.update.mockResolvedValue({ ...mockCard, status: 'IN_PROGRESS' });

      const result = await _updateCardStatus('card-123', 'IN_PROGRESS', mockDeps);

      expect(result).toEqual({ success: true, status: 'IN_PROGRESS' });
      expect(mockDb.card.update).toHaveBeenCalledWith({
        where: { id: 'card-123' },
        data: { status: 'IN_PROGRESS' },
      });
    });

    it('should update status to DONE', async () => {
      mockDb.card.findUnique.mockResolvedValue(mockCard);
      mockDb.card.update.mockResolvedValue({ ...mockCard, status: 'DONE' });

      const result = await _updateCardStatus('card-123', 'DONE', mockDeps);

      expect(result).toEqual({ success: true, status: 'DONE' });
      expect(mockDb.card.update).toHaveBeenCalledWith({
        where: { id: 'card-123' },
        data: { status: 'DONE' },
      });
    });

    it('should handle database error gracefully', async () => {
      mockDb.card.findUnique.mockResolvedValue(mockCard);
      mockDb.card.update.mockRejectedValue(new Error('Database error'));

      const result = await _updateCardStatus('card-123', 'DONE', mockDeps);

      expect(result).toEqual({ error: 'Gagal mengupdate status' });
    });
  });
});
