// web/app/page.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LandingPage from './page';

// Mock 'auth' karena itu fungsi server
vi.mock('@/lib/auth', () => ({
  auth: vi.fn().mockResolvedValue(null), // Simulasi user belum login
}));

// Mock komponen Next/Link karena kita di environment test
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

describe('Landing Page', () => {
  it('merender judul utama Flerro', async () => {
    const ui = await LandingPage();
    render(ui);

    // Gunakan getAllByText karena ada banyak elemen dengan "Flerro"
    const flerroElements = screen.getAllByText(/Flerro/i);
    expect(flerroElements.length).toBeGreaterThan(0);
  });

  it('merender hero section dengan tagline', async () => {
    const ui = await LandingPage();
    render(ui);

    // Cek tagline/description
    expect(screen.getByText(/kolaborasi modern/i)).toBeInTheDocument();
  });

  it('merender link ke login', async () => {
    const ui = await LandingPage();
    render(ui);

    // Cek ada link ke halaman login
    const loginLinks = screen.getAllByRole('link', { name: /login|masuk|mulai|gratis/i });
    expect(loginLinks.length).toBeGreaterThan(0);
  });

  it('merender fitur-fitur utama', async () => {
    const ui = await LandingPage();
    render(ui);

    // Gunakan getAllByText karena ada multiple matches
    const kanbanElements = screen.getAllByText(/Kanban/i);
    expect(kanbanElements.length).toBeGreaterThan(0);

    const realtimeElements = screen.getAllByText(/real-time/i);
    expect(realtimeElements.length).toBeGreaterThan(0);
  });
});
