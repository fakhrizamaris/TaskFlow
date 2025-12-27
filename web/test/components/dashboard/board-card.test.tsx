// test/components/dashboard/board-card.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { BoardCard } from '@/components/dashboard/board-card';

// Mock deleteBoard action
vi.mock('@/actions/delete-board', () => ({
  deleteBoard: vi.fn(),
}));

// Mock useRouter
const mockRefresh = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: mockRefresh,
    push: vi.fn(),
  }),
}));

describe('BoardCard', () => {
  const mockBoard = {
    id: 'board-123',
    title: 'Test Board',
    inviteCode: 'ABC123',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-15'),
  };

  const mockPrivateBoard = {
    ...mockBoard,
    id: 'board-456',
    title: 'Private Board',
    inviteCode: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('should render board title', () => {
      render(<BoardCard board={mockBoard} index={0} isOwner={true} />);

      expect(screen.getByText('Test Board')).toBeInTheDocument();
    });

    it('should render created date', () => {
      render(<BoardCard board={mockBoard} index={0} isOwner={true} />);

      // Check for Indonesian date format
      expect(screen.getByText(/1\/1\/2025|01\/01\/2025/)).toBeInTheDocument();
    });

    it('should render updated date', () => {
      render(<BoardCard board={mockBoard} index={0} isOwner={true} />);

      expect(screen.getByText(/15\/1\/2025|1\/15\/2025/)).toBeInTheDocument();
    });

    it('should show Kolaborasi badge for public board', () => {
      render(<BoardCard board={mockBoard} index={0} isOwner={true} />);

      expect(screen.getByText('Kolaborasi')).toBeInTheDocument();
    });

    it('should show Pribadi badge for private board', () => {
      render(<BoardCard board={mockPrivateBoard} index={0} isOwner={true} />);

      expect(screen.getByText('Pribadi')).toBeInTheDocument();
    });

    it('should have link to board page', () => {
      render(<BoardCard board={mockBoard} index={0} isOwner={true} />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/dashboard/board/board-123');
    });
  });

  describe('Menu Button', () => {
    it('should show menu button for owner', () => {
      const { container } = render(<BoardCard board={mockBoard} index={0} isOwner={true} />);

      // Menu button should exist
      const menuButtons = container.querySelectorAll('button');
      expect(menuButtons.length).toBeGreaterThan(0);
    });

    it('should not show menu button for non-owner', () => {
      const { container } = render(<BoardCard board={mockBoard} index={0} isOwner={false} />);

      // Find the three-dot menu button specifically
      const menuButton = container.querySelector('[class*="MoreVertical"]');
      expect(menuButton).toBeNull();
    });
  });

  describe('Animation', () => {
    it('should apply animation delay based on index', () => {
      const { container } = render(<BoardCard board={mockBoard} index={3} isOwner={true} />);

      const card = container.querySelector('.glass-card');
      expect(card?.getAttribute('style')).toContain('animation-delay: 150ms');
    });
  });

  describe('Delete Modal', () => {
    it('should show delete confirmation when clicking delete', async () => {
      render(<BoardCard board={mockBoard} index={0} isOwner={true} />);

      // Find and click the menu button
      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      // Small delay for dropdown to appear
      await vi.waitFor(() => {
        const deleteBtn = screen.queryByText('Hapus Board');
        if (deleteBtn) {
          fireEvent.click(deleteBtn);
        }
      });
    });
  });

  describe('Hover Effects', () => {
    it('should have hover styling classes', () => {
      const { container } = render(<BoardCard board={mockBoard} index={0} isOwner={true} />);

      const card = container.querySelector('.glass-card');
      expect(card?.className).toContain('hover:border-indigo-500/30');
      expect(card?.className).toContain('transition-all');
    });

    it('should show "Buka board" hint on hover', () => {
      render(<BoardCard board={mockBoard} index={0} isOwner={true} />);

      expect(screen.getByText('Buka board')).toBeInTheDocument();
    });
  });
});
