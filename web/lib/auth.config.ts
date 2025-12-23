// web/lib/auth.config.ts
import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';

// Konfigurasi ini berisi providers
// Credentials authorize akan di-override di auth.ts
export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      // This will be overridden in auth.ts where we have access to Prisma
      authorize: async () => null,
    }),
  ],
  // Wajib untuk middleware: Pakai strategi JWT agar satpam tidak perlu cek DB terus
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
} satisfies NextAuthConfig;
