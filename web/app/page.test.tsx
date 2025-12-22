// web/app/page.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LandingPage from './page'; // Import Landing Page kamu

// Kita harus men-mock 'auth' karena itu fungsi server
vi.mock('@/lib/auth', () => ({
  auth: vi.fn().mockResolvedValue(null), // Simulasi user belum login
}));

// Mock komponen Next/Link karena kita di environment test
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

describe('Landing Page', () => {
  it('merender judul utama', async () => {
    // Render halaman (Async component perlu diawait di test modern, tapi untuk unit test simple kita render hasil fungsinya)
    // Catatan: Testing Server Component (Async) di Unit Test agak tricky.
    // Untuk pemula, lebih mudah mengetes "Client Component".

    const ui = await LandingPage();
    render(ui);

    // Cari teks "TaskFlow"
    const heading = screen.getByText(/TaskFlow/i);
    expect(heading).toBeInTheDocument();
  });
});
