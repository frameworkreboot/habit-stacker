import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check auth condition
  const isAuth = !!session;
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');

  // If not authenticated and not on auth page, redirect to auth page
  if (!isAuth && !isAuthPage) {
    const redirectUrl = new URL('/auth', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If authenticated and on auth page, redirect to dashboard
  if (isAuth && isAuthPage) {
    const redirectUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/auth/:path*',
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
}; 