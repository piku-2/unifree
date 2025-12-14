import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { Database } from "@/supabase/types";

const PROTECTED_PATHS = ["/sell", "/mypage", "/admin", "/chat"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /**
   * ✅ 認証コールバックは完全素通し（PKCE 保護）
   */
  if (pathname.startsWith("/auth/callback")) {
    return NextResponse.next();
  }

  /**
   * 認証不要パスは素通し
   */
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (!isProtected) {
    return NextResponse.next();
  }

  /**
   * Supabase Server Client（Cookie 連携）
   */
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
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  /**
   * 認証チェック
   */
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirectedFrom", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return response;
}

/**
 * ✅ matcher レベルでも auth/callback を完全除外
 */
export const config = {
  matcher: ["/((?!_next|favicon.ico|auth/callback).*)"],
};
