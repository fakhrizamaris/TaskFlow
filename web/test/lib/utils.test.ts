// test/lib/utils.test.ts
import { describe, it, expect } from 'vitest';

// Utility functions to test
// Since these are common patterns in the codebase, let's create tests for them

describe('Utility Functions', () => {
  describe('Date Formatting', () => {
    it('should format date in Indonesian locale', () => {
      const date = new Date('2025-12-25T10:30:00.000Z');
      const formatted = date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      expect(formatted).toContain('2025');
      expect(formatted).toContain('Desember');
    });

    it('should format date with time', () => {
      const date = new Date('2025-12-25T10:30:00.000Z');
      const formatted = date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      expect(formatted).toContain('2025');
    });
  });

  describe('Invite Code Generation', () => {
    it('should generate 6 character uppercase code from UUID', () => {
      // Simulate the logic used in create-board.ts
      const uuid = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
      const inviteCode = uuid.substring(0, 6).toUpperCase();

      expect(inviteCode).toBe('A1B2C3');
      expect(inviteCode).toHaveLength(6);
      expect(inviteCode).toMatch(/^[A-Z0-9]+$/);
    });
  });

  describe('Time Remaining Calculation', () => {
    it('should calculate hours remaining correctly', () => {
      const now = new Date();
      const deadline = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours

      const diffMs = deadline.getTime() - now.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      expect(diffHours).toBe(2);
      expect(diffMinutes).toBeLessThan(60);
    });

    it('should detect overdue status', () => {
      const now = new Date();
      const deadline = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago

      const isOverdue = deadline.getTime() < now.getTime();

      expect(isOverdue).toBe(true);
    });

    it('should detect due today', () => {
      const now = new Date();
      const deadline = new Date(now.getTime() + 5 * 60 * 60 * 1000); // 5 hours from now

      const isToday = deadline.toDateString() === now.toDateString();

      expect(isToday).toBe(true);
    });
  });

  describe('String Validation', () => {
    it('should validate minimum title length', () => {
      const isValidTitle = (title: string) => title.length >= 3;

      expect(isValidTitle('')).toBe(false);
      expect(isValidTitle('AB')).toBe(false);
      expect(isValidTitle('ABC')).toBe(true);
      expect(isValidTitle('My Board Title')).toBe(true);
    });

    it('should validate maximum title length', () => {
      const isValidTitle = (title: string) => title.length <= 50;

      expect(isValidTitle('Short')).toBe(true);
      expect(isValidTitle('A'.repeat(50))).toBe(true);
      expect(isValidTitle('A'.repeat(51))).toBe(false);
    });

    it('should validate invite code format', () => {
      const isValidInviteCode = (code: string) => /^[A-Z0-9]{6}$/.test(code);

      expect(isValidInviteCode('ABC123')).toBe(true);
      expect(isValidInviteCode('abc123')).toBe(false); // lowercase
      expect(isValidInviteCode('ABCDE')).toBe(false); // too short
      expect(isValidInviteCode('ABCDEFG')).toBe(false); // too long
      expect(isValidInviteCode('ABC-12')).toBe(false); // contains special char
    });
  });

  describe('Order Calculation', () => {
    it('should calculate new order as 1 when no existing items', () => {
      const lastOrder = null;
      const newOrder = lastOrder ? lastOrder + 1 : 1;

      expect(newOrder).toBe(1);
    });

    it('should increment order from last item', () => {
      const lastOrder = 5;
      const newOrder = lastOrder ? lastOrder + 1 : 1;

      expect(newOrder).toBe(6);
    });
  });

  describe('Email Validation', () => {
    it('should validate email format', () => {
      const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.org')).toBe(true);
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
    });
  });

  describe('Card Status', () => {
    it('should validate card status values', () => {
      const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
      const isValidStatus = (status: string) => validStatuses.includes(status);

      expect(isValidStatus('TODO')).toBe(true);
      expect(isValidStatus('IN_PROGRESS')).toBe(true);
      expect(isValidStatus('DONE')).toBe(true);
      expect(isValidStatus('INVALID')).toBe(false);
      expect(isValidStatus('todo')).toBe(false); // case sensitive
    });

    it('should get next status in cycle', () => {
      const getNextStatus = (current: string) => {
        const cycle = ['TODO', 'IN_PROGRESS', 'DONE'];
        const currentIndex = cycle.indexOf(current);
        return cycle[(currentIndex + 1) % cycle.length];
      };

      expect(getNextStatus('TODO')).toBe('IN_PROGRESS');
      expect(getNextStatus('IN_PROGRESS')).toBe('DONE');
      expect(getNextStatus('DONE')).toBe('TODO');
    });
  });
});
