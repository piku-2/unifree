'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasHandled = useRef(false);

  useEffect(() => {
    if (hasHandled.current) return;
    hasHandled.current = true;

    const callbackError =
      searchParams.get('error') ?? searchParams.get('error_description');
    if (callbackError) {
      router.replace(`/login?error=${encodeURIComponent(callbackError)}`);
      return;
    }

    const code = searchParams.get('code');
    if (!code) {
      router.replace('/login?error=missing_code');
      return;
    }

    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        const message = error?.message ?? 'auth_failed';
        router.replace(`/login?error=${encodeURIComponent(message)}`);
        return;
      }
      router.replace('/');
    });
  }, [router, searchParams]);

  return null;
}
