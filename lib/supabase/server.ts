import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { Database } from '../../supabase/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function supabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(supabaseUrl ?? '', supabaseAnonKey ?? '', {
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
