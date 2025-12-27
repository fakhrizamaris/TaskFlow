// test/mocks/deps.ts
import { vi } from 'vitest';
import { createMockDb } from './db';
import { createMockAuth } from './auth';

// Create mock dependencies untuk testing
export const createMockDeps = (session = null) => {
  const mockDb = createMockDb();
  const mockAuth = vi.fn().mockResolvedValue(session);

  return {
    db: mockDb as any,
    auth: mockAuth,
  };
};

export type MockDeps = ReturnType<typeof createMockDeps>;
