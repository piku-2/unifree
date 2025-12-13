// app/auth/callback/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { code?: string; error?: string };
}) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  if (searchParams.error) {
    redirect(`/login?error=${encodeURIComponent(searchParams.error)}`);
  }

  const code = searchParams.code;
  if (!code) {
    redirect("/login?error=missing_code");
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    redirect("/login?error=auth_failed");
  }

  redirect("/");
}
