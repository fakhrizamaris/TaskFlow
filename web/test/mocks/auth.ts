// test/mocks/auth.ts
import { vi } from 'vitest';

export const mockSession = {
  user: {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    image: null,
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

export const mockSessionNoUser = null;

export const createMockAuth = (session = mockSession) => {
  return vi.fn().mockResolvedValue(session);
};
