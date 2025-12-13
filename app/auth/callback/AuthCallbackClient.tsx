'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasHandled = useRef(false);

  useEffect(() => {
    if (hasHandled.current) return;
    hasHandled.current = true;

    const handleCallback = async () => {
      const callbackError =
        searchParams.get('error') ?? searchParams.get('error_description');
      if (callbackError) {
        router.replace(`/login?error=${encodeURIComponent(callbackError)}`);
        return;
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error(sessionError);
      }
      if (sessionData?.session) {
        router.replace('/');
        return;
      }

      const code = searchParams.get('code');
      if (!code) {
        router.replace('/login?error=missing_code');
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        const message = error?.message ?? 'auth_failed';
        router.replace(`/login?error=${encodeURIComponent(message)}`);
        return;
      }

      router.replace('/');
    };

    handleCallback();
  }, [router, searchParams]);

  return null;
}
