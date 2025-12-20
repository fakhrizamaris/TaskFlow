// web/lib/auth.config.ts
import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

// Konfigurasi ini HANYA berisi providers dan logic ringan
// TIDAK BOLEH ada Prisma di sini
export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  // Wajib untuk middleware: Pakai strategi JWT agar satpam tidak perlu cek DB terus
  session: { strategy: 'jwt' },
} satisfies NextAuthConfig;
