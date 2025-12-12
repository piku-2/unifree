// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error_description");

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookies().get(name)?.value,
        set: (name, value, options) =>
          cookies().set({ name, value, ...options }),
        remove: (name, options) =>
          cookies().set({ name, value: "", ...options }),
      },
    }
  );

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
    code
  );

  if (exchangeError) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  return NextResponse.redirect(`${origin}/`);
}
