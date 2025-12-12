import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/sell', '/mypage', '/chat', '/admin'];

export function middleware(req: NextRequest) {
  const hasSession =
    req.cookies.get('sb-access-token')?.value && req.cookies.get('sb-refresh-token')?.value;

  const pathname = req.nextUrl.pathname;
  const isProtected = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (isProtected && !hasSession) {
    const url = new URL('/login', req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/sell/:path*', '/mypage/:path*', '/chat/:path*', '/admin/:path*'],
};
