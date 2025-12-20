// web/lib/auth.ts
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from '@/lib/db';
import authConfig from '@/lib/auth.config'; // 1. Import config ringan ini

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  ...authConfig, // Spread authConfig yang sudah berisi session: { strategy: 'jwt' }
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    // Callback JWT wajib ada untuk mem-pass ID ke session
    async jwt({ token }) {
      return token;
    },
  },
});
