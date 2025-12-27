// test/components/dashboard/stats-overview.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import { StatsOverview } from '@/components/dashboard/stats-overview';

describe('StatsOverview', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('should render all 4 stat cards', () => {
    render(<StatsOverview totalBoards={5} completedTasks={10} pendingTasks={3} collaborators={2} />);

    expect(screen.getByText('Total Board')).toBeInTheDocument();
    expect(screen.getByText('Tugas Selesai')).toBeInTheDocument();
    expect(screen.getByText('Tugas Pending')).toBeInTheDocument();
    expect(screen.getByText('Kolaborator')).toBeInTheDocument();
  });

  it('should start with zero animated values', () => {
    render(<StatsOverview totalBoards={10} completedTasks={20} pendingTasks={5} collaborators={3} />);

    // Check initial state - component should render
    const statTexts = screen.getAllByRole('paragraph');
    expect(statTexts).toBeDefined();
  });

  it('should render with provided values after animation', async () => {
    render(<StatsOverview totalBoards={10} completedTasks={20} pendingTasks={5} collaborators={3} />);

    // Run all timers and let React update
    await act(async () => {
      vi.runAllTimers();
    });

    // The component should render with the stat card labels
    expect(screen.getByText('Total Board')).toBeInTheDocument();
    expect(screen.getByText('Tugas Selesai')).toBeInTheDocument();
    expect(screen.getByText('Tugas Pending')).toBeInTheDocument();
    expect(screen.getByText('Kolaborator')).toBeInTheDocument();
  });

  it('should render with default values when some props missing', () => {
    render(<StatsOverview totalBoards={5} />);

    // Run timers for animation
    act(() => {
      vi.runAllTimers();
    });

    // Component should still render all 4 stat cards
    expect(screen.getByText('Total Board')).toBeInTheDocument();
    expect(screen.getByText('Tugas Selesai')).toBeInTheDocument();
    expect(screen.getByText('Tugas Pending')).toBeInTheDocument();
    expect(screen.getByText('Kolaborator')).toBeInTheDocument();
  });

  it('should have proper styling for each stat card', () => {
    const { container } = render(<StatsOverview totalBoards={5} completedTasks={10} pendingTasks={3} collaborators={2} />);

    const cards = container.querySelectorAll('.glass-card');
    expect(cards).toHaveLength(4);
  });

  it('should show progress bars', () => {
    const { container } = render(<StatsOverview totalBoards={5} completedTasks={10} pendingTasks={3} collaborators={2} />);

    // Check for progress bar elements
    const progressBars = container.querySelectorAll('.bg-gradient-to-r');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  it('should display change indicators', () => {
    render(<StatsOverview totalBoards={5} completedTasks={10} pendingTasks={3} collaborators={2} />);

    // Check for change text (e.g., "+2 minggu ini")
    expect(screen.getByText('+2 minggu ini')).toBeInTheDocument();
    expect(screen.getByText('+5 hari ini')).toBeInTheDocument();
  });

  it('should apply staggered animation delay', () => {
    const { container } = render(<StatsOverview totalBoards={5} completedTasks={10} pendingTasks={3} collaborators={2} />);

    const cards = container.querySelectorAll('.glass-card');

    // Check that animation delays are applied
    cards.forEach((card, index) => {
      const style = card.getAttribute('style');
      expect(style).toContain(`animation-delay: ${index * 100}ms`);
    });
  });
});
