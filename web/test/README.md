# 🧪 Test Suite untuk Flerro

Dokumentasi ini menjelaskan struktur dan cara menjalankan test untuk aplikasi Flerro.

## Struktur Test

```
test/
├── setup.ts                     # Setup global untuk Vitest
├── mocks/
│   ├── auth.ts                  # Mock untuk authentication
│   └── db.ts                    # Mock untuk database Prisma
├── actions/                     # Unit tests untuk Server Actions
│   ├── create-board.test.ts
│   ├── create-card.test.ts
│   ├── create-list.test.ts
│   ├── delete-board.test.ts
│   ├── delete-list.test.ts
│   ├── invite-member.test.ts
│   ├── join-board.test.ts
│   ├── update-card-deadline.test.ts
│   └── update-card-status.test.ts
├── lib/
│   ├── email-templates.test.ts  # Test untuk email templates
│   └── utils.test.ts            # Test untuk utility functions
├── components/
│   ├── dashboard/
│   │   ├── board-card.test.tsx
│   │   └── stats-overview.test.tsx
│   └── tutorial/
│       └── onboarding-tour.test.tsx
└── integration/
    └── board-workflow.test.ts   # Integration tests
```

## Menjalankan Tests

```bash
# Jalankan semua tests
npm run test

# Jalankan sekali (tanpa watch mode)
npm run test -- --run

# Jalankan dengan coverage report
npm run test -- --coverage

# Jalankan test spesifik
npm run test -- test/lib/utils.test.ts
```

## Test Categories

### 1. Unit Tests - Server Actions

Test untuk setiap server action mencakup:

- ✅ Authentication checks
- ✅ Authorization/permission checks
- ✅ Input validation
- ✅ Database operations
- ✅ Error handling

### 2. Unit Tests - Email Templates

- ✅ Welcome email generation
- ✅ Deadline reminder email generation
- ✅ Dark mode support
- ✅ Indonesian localization

### 3. Unit Tests - Utility Functions

- ✅ Date formatting
- ✅ Invite code generation
- ✅ Time remaining calculation
- ✅ Status validation
- ✅ Email validation

### 4. Component Tests

- ✅ StatsOverview - animated counters
- ✅ BoardCard - render & delete modal
- ✅ OnboardingTour - tutorial steps

### 5. Integration Tests

- ✅ Board creation workflow
- ✅ List & Card ordering
- ✅ Collaboration flow
- ✅ Status cycling
- ✅ Deadline detection
- ✅ Delete cascade

## Test Mocking Strategy

### Authentication Mock

```typescript
const mockSession = {
  user: {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
  },
  expires: new Date().toISOString(),
};
```

### Database Mock

```typescript
const mockDb = {
  user: { findUnique: vi.fn(), create: vi.fn(), ... },
  board: { findUnique: vi.fn(), create: vi.fn(), delete: vi.fn(), ... },
  list: { findUnique: vi.fn(), create: vi.fn(), delete: vi.fn(), ... },
  card: { findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), ... },
  boardMember: { findUnique: vi.fn(), create: vi.fn(), ... },
};
```

## Known Limitations

1. **Prisma Client**: Server actions yang langsung import Prisma membutuhkan setup khusus atau refactoring untuk dependency injection.

2. **Next.js Server Components**: Komponen server tidak bisa langsung di-test dengan @testing-library/react.

3. **Real-time Features**: Socket.IO events perlu setup terpisah untuk testing.

## Rekomendasi

Untuk production, pertimbangkan:

1. Menambahkan E2E tests dengan Playwright
2. Refactoring server actions untuk dependency injection
3. Menambahkan API integration tests
4. Setup CI/CD untuk automated testing
