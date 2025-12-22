// web/proxy.ts
import NextAuth from 'next-auth';
import authConfig from '@/lib/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard');
  const isOnLogin = req.nextUrl.pathname.startsWith('/login');

  // 1. Jika user ada di Dashboard tapi belum login -> Tendang ke Login
  if (isOnDashboard && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl));
  }

  // 2. Jika user ada di Login tapi sudah login -> Tendang ke Dashboard
  if (isOnLogin && isLoggedIn) {
    return Response.redirect(new URL('/dashboard', req.nextUrl));
  }
});

// Konfigurasi agar proxy berjalan di rute tertentu saja
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
