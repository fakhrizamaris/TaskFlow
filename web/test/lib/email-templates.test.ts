// test/lib/email-templates.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock process.env
vi.stubEnv('NEXTAUTH_URL', 'https://flerro.app');
vi.stubEnv('AUTH_URL', 'https://flerro.app');

import { getWelcomeEmailTemplate, getWelcomeEmailText, getDeadlineReminderTemplate, getDeadlineReminderText } from '@/lib/email-templates';

describe('Email Templates', () => {
  describe('getWelcomeEmailTemplate', () => {
    it('should return HTML template with user name', () => {
      const html = getWelcomeEmailTemplate('John Doe');

      expect(html).toContain('John Doe');
      expect(html).toContain('Selamat Datang di Flerro');
      expect(html).toContain('<!DOCTYPE html>');
    });

    it('should include dashboard link', () => {
      const html = getWelcomeEmailTemplate('Jane');

      expect(html).toContain('/dashboard');
      expect(html).toContain('Buka Dashboard');
    });

    it('should include feature list', () => {
      const html = getWelcomeEmailTemplate('User');

      expect(html).toContain('Buat Board');
      expect(html).toContain('Track Status');
      expect(html).toContain('Set Deadline');
      expect(html).toContain('Kolaborasi');
    });

    it('should include current year in footer', () => {
      const html = getWelcomeEmailTemplate('User');
      const currentYear = new Date().getFullYear().toString();

      expect(html).toContain(currentYear);
    });

    it('should support dark mode', () => {
      const html = getWelcomeEmailTemplate('User');

      expect(html).toContain('prefers-color-scheme: dark');
      expect(html).toContain('color-scheme: light dark');
    });
  });

  describe('getWelcomeEmailText', () => {
    it('should return plain text with user name', () => {
      const text = getWelcomeEmailText('John Doe');

      expect(text).toContain('John Doe');
      expect(text).toContain('SELAMAT DATANG');
    });

    it('should include features in plain text', () => {
      const text = getWelcomeEmailText('User');

      expect(text).toContain('Buat Board');
      expect(text).toContain('Track Status');
      expect(text).toContain('Set Deadline');
      expect(text).toContain('Kolaborasi');
    });

    it('should include dashboard URL', () => {
      const text = getWelcomeEmailText('User');

      expect(text).toContain('/dashboard');
    });
  });

  describe('getDeadlineReminderTemplate', () => {
    const upcomingTask = {
      cardTitle: 'Complete documentation',
      listTitle: 'In Progress',
      boardTitle: 'Project Alpha',
      dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      timeRemaining: '2 Jam',
      isOverdue: false,
    };

    const overdueTask = {
      cardTitle: 'Submit report',
      listTitle: 'TODO',
      boardTitle: 'Project Beta',
      dueDate: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      timeRemaining: 'Terlambat 1 Jam',
      isOverdue: true,
    };

    it('should return HTML template with user name', () => {
      const html = getDeadlineReminderTemplate('John', [upcomingTask]);

      expect(html).toContain('John');
      expect(html).toContain('<!DOCTYPE html>');
    });

    it('should display task details', () => {
      const html = getDeadlineReminderTemplate('User', [upcomingTask]);

      expect(html).toContain('Complete documentation');
      expect(html).toContain('In Progress');
      expect(html).toContain('Project Alpha');
    });

    it('should show different header for overdue tasks', () => {
      const html = getDeadlineReminderTemplate('User', [overdueTask]);

      expect(html).toContain('Deadline Terlewati');
      expect(html).toContain('⚠️');
    });

    it('should show reminder header for upcoming tasks', () => {
      const html = getDeadlineReminderTemplate('User', [upcomingTask]);

      expect(html).toContain('Deadline Reminder');
      expect(html).toContain('⏰');
    });

    it('should include Google Calendar link', () => {
      const html = getDeadlineReminderTemplate('User', [upcomingTask]);

      expect(html).toContain('calendar.google.com');
      expect(html).toContain('Tambah ke Calendar');
    });

    it('should handle multiple tasks', () => {
      const html = getDeadlineReminderTemplate('User', [upcomingTask, overdueTask]);

      expect(html).toContain('Complete documentation');
      expect(html).toContain('Submit report');
    });

    it('should use red gradient for overdue', () => {
      const html = getDeadlineReminderTemplate('User', [overdueTask]);

      expect(html).toContain('#b91c1c'); // Red color
    });

    it('should use purple gradient for upcoming', () => {
      const html = getDeadlineReminderTemplate('User', [upcomingTask]);

      expect(html).toContain('#7c3aed'); // Purple color
    });
  });

  describe('getDeadlineReminderText', () => {
    const task = {
      cardTitle: 'Test Task',
      listTitle: 'TODO',
      boardTitle: 'Test Board',
      dueDate: new Date(),
      timeRemaining: '1 Jam',
      isOverdue: false,
    };

    it('should return plain text with user name', () => {
      const text = getDeadlineReminderText('John', [task]);

      expect(text).toContain('John');
    });

    it('should include task details', () => {
      const text = getDeadlineReminderText('User', [task]);

      expect(text).toContain('Test Task');
      expect(text).toContain('TODO');
      expect(text).toContain('Test Board');
    });

    it('should show PERHATIAN for overdue tasks', () => {
      const overdueTask = { ...task, isOverdue: true };
      const text = getDeadlineReminderText('User', [overdueTask]);

      expect(text).toContain('PERHATIAN');
    });

    it('should show REMINDER for upcoming tasks', () => {
      const text = getDeadlineReminderText('User', [task]);

      expect(text).toContain('REMINDER');
    });
  });
});
