import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { Database } from '../../supabase/types';

function requireEnv(names: string[]) {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(
      `[supabase] Missing required environment variable(s): ${missing.join(', ')}`
    );
  }

  const values: Record<string, string> = {};
  names.forEach((name) => {
    values[name] = process.env[name] as string;
  });
  return values;
}

export function supabaseServerClient() {
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = requireEnv([
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]);
  const cookieStore = cookies();

  return createServerClient<Database>(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set({ name, value, ...options });
        });
      },
    },
  });
}
