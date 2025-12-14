import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { Database } from "./supabase/types";

const PROTECTED_PATHS = ["/sell", "/mypage", "/admin", "/chat"];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  // auth/callback は絶対に素通し
  if (pathname.startsWith("/auth/callback")) {
    return NextResponse.next();
  }

  if (!isProtected) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set({ name, value, ...options });
          });
        },
      },
    }
  );

  // ❌ getUser() は使わない
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
