// test/components/tutorial/onboarding-tour.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { OnboardingTour } from '@/components/tutorial/onboarding-tour';

// Mock driver.js
const mockDrive = vi.fn();
const mockDestroy = vi.fn();

vi.mock('driver.js', () => ({
  driver: vi.fn(() => ({
    drive: mockDrive,
    destroy: mockDestroy,
  })),
}));

// Mock completeTutorial action
vi.mock('@/actions/user-progress', () => ({
  completeTutorial: vi.fn(),
}));

describe('OnboardingTour', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should not render any visible UI', () => {
    const { container } = render(<OnboardingTour showTutorial={true} />);

    expect(container.firstChild).toBeNull();
  });

  it('should not start tour when showTutorial is false', () => {
    render(<OnboardingTour showTutorial={false} />);

    expect(mockDrive).not.toHaveBeenCalled();
  });

  it('should start tour when showTutorial is true', async () => {
    render(<OnboardingTour showTutorial={true} />);

    // Wait for useEffect
    await vi.waitFor(() => {
      expect(mockDrive).toHaveBeenCalled();
    });
  });

  it('should configure driver with correct options', async () => {
    const { driver } = await import('driver.js');

    render(<OnboardingTour showTutorial={true} />);

    await vi.waitFor(() => {
      expect(driver).toHaveBeenCalledWith(
        expect.objectContaining({
          showProgress: true,
          animate: true,
          allowClose: false,
          doneBtnText: 'Siap Mulai! 🚀',
          nextBtnText: 'Lanjut →',
          prevBtnText: '← Kembali',
        })
      );
    });
  });

  it('should have correct number of steps', async () => {
    const { driver } = await import('driver.js');

    render(<OnboardingTour showTutorial={true} />);

    await vi.waitFor(() => {
      const driverCall = (driver as any).mock.calls[0][0];
      expect(driverCall.steps).toHaveLength(8); // 8 tutorial steps
    });
  });

  it('should have welcome step as first step', async () => {
    const { driver } = await import('driver.js');

    render(<OnboardingTour showTutorial={true} />);

    await vi.waitFor(() => {
      const driverCall = (driver as any).mock.calls[0][0];
      expect(driverCall.steps[0].element).toBe('#welcome-header');
      expect(driverCall.steps[0].popover.title).toContain('Selamat Datang');
    });
  });

  it('should have create board step', async () => {
    const { driver } = await import('driver.js');

    render(<OnboardingTour showTutorial={true} />);

    await vi.waitFor(() => {
      const driverCall = (driver as any).mock.calls[0][0];
      const createBoardStep = driverCall.steps.find((step: any) => step.element === '#create-board-btn');
      expect(createBoardStep).toBeDefined();
    });
  });

  it('should include deadline feature step', async () => {
    const { driver } = await import('driver.js');

    render(<OnboardingTour showTutorial={true} />);

    await vi.waitFor(() => {
      const driverCall = (driver as any).mock.calls[0][0];
      const deadlineStep = driverCall.steps.find((step: any) => step.popover?.title?.includes('Deadline'));
      expect(deadlineStep).toBeDefined();
    });
  });

  it('should include collaboration feature step', async () => {
    const { driver } = await import('driver.js');

    render(<OnboardingTour showTutorial={true} />);

    await vi.waitFor(() => {
      const driverCall = (driver as any).mock.calls[0][0];
      const collabStep = driverCall.steps.find((step: any) => step.popover?.title?.includes('Kolaborasi'));
      expect(collabStep).toBeDefined();
    });
  });
});
