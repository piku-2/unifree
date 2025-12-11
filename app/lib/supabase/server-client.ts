'use server';

import { cookies, headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/libs/supabase/types';

export function createServerClientInstance() {
  const cookieStore = cookies();

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          // Forward any incoming headers you need (e.g., for RLS tracing)
          'X-Forwarded-For': headers().get('x-forwarded-for') ?? undefined,
        },
      },
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    },
  );
}
