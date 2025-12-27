// test/actions/update-card-deadline.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockDb, mockCard } from '../mocks/db';
import { mockSession } from '../mocks/auth';

vi.mock('@/lib/deps', () => ({
  defaultDeps: { db: {}, auth: vi.fn() },
}));

import { _updateCardDeadline } from '@/actions/update-card-deadline';

const mockDb = createMockDb();
const mockAuth = vi.fn();
const mockDeps = { db: mockDb as any, auth: mockAuth };

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('updateCardDeadline', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue(mockSession);
  });

  describe('Authentication', () => {
    it('should return error when user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null);

      const result = await _updateCardDeadline('card-123', '2025-12-31T10:00:00.000Z', mockDeps);

      expect(result).toEqual({ error: 'Unauthorized' });
    });

    it('should return error when session has no email', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user-123' } });

      const result = await _updateCardDeadline('card-123', '2025-12-31T10:00:00.000Z', mockDeps);

      expect(result).toEqual({ error: 'Unauthorized' });
    });
  });

  describe('Card Finding', () => {
    it('should return error when card is not found', async () => {
      mockDb.card.findUnique.mockResolvedValue(null);

      const result = await _updateCardDeadline('nonexistent-card', '2025-12-31T10:00:00.000Z', mockDeps);

      expect(result).toEqual({ error: 'Card tidak ditemukan' });
    });
  });

  describe('Date Parsing', () => {
    it('should return error for invalid date format', async () => {
      mockDb.card.findUnique.mockResolvedValue(mockCard);

      const result = await _updateCardDeadline('card-123', 'invalid-date', mockDeps);

      expect(result).toEqual({ error: 'Format tanggal tidak valid' });
    });

    it('should parse ISO date format correctly', async () => {
      mockDb.card.findUnique.mockResolvedValue(mockCard);
      mockDb.card.update.mockResolvedValue(mockCard);

      const isoDate = '2025-12-31T10:00:00.000Z';
      const result = await _updateCardDeadline('card-123', isoDate, mockDeps);

      expect(result.success).toBe(true);
      expect(result.dueDate).toBe(isoDate);
    });

    it('should handle date without milliseconds', async () => {
      mockDb.card.findUnique.mockResolvedValue(mockCard);
      mockDb.card.update.mockResolvedValue(mockCard);

      const result = await _updateCardDeadline('card-123', '2025-12-31T10:00', mockDeps);

      expect(result.success).toBe(true);
      expect(result.dueDate).toBeDefined();
    });
  });

  describe('Deadline Update', () => {
    it('should update deadline successfully', async () => {
      mockDb.card.findUnique.mockResolvedValue(mockCard);
      mockDb.card.update.mockResolvedValue(mockCard);

      const dueDate = '2025-12-31T10:00:00.000Z';
      const result = await _updateCardDeadline('card-123', dueDate, mockDeps);

      expect(result.success).toBe(true);
      expect(mockDb.card.update).toHaveBeenCalledWith({
        where: { id: 'card-123' },
        data: {
          dueDate: expect.any(Date),
        },
      });
    });

    it('should clear deadline when null is passed', async () => {
      mockDb.card.findUnique.mockResolvedValue(mockCard);
      mockDb.card.update.mockResolvedValue(mockCard);

      const result = await _updateCardDeadline('card-123', null, mockDeps);

      expect(result.success).toBe(true);
      expect(result.dueDate).toBeNull();
      expect(mockDb.card.update).toHaveBeenCalledWith({
        where: { id: 'card-123' },
        data: {
          dueDate: null,
        },
      });
    });

    it('should handle database error gracefully', async () => {
      mockDb.card.findUnique.mockResolvedValue(mockCard);
      mockDb.card.update.mockRejectedValue(new Error('Database error'));

      const result = await _updateCardDeadline('card-123', '2025-12-31T10:00:00.000Z', mockDeps);

      expect(result.error).toContain('Gagal mengupdate deadline');
    });

    it('should detect missing dueDate column error', async () => {
      mockDb.card.findUnique.mockResolvedValue(mockCard);
      mockDb.card.update.mockRejectedValue(new Error('column dueDate does not exist'));

      const result = await _updateCardDeadline('card-123', '2025-12-31T10:00:00.000Z', mockDeps);

      expect(result.error).toContain('Kolom dueDate belum ada');
    });
  });
});
