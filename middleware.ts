import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPrefixes = ['/mypage', '/sell', '/chat', '/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedPrefixes.some((prefix) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Minimal check: presence of Supabase access token cookie
  const hasAccessToken = request.cookies.has('sb-access-token');

  if (!hasAccessToken) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/mypage/:path*', '/sell/:path*', '/chat/:path*', '/admin/:path*'],
};
