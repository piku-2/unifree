import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { Database } from '../../supabase/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function supabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(supabaseUrl ?? '', supabaseAnonKey ?? '', {
    cookies: {
      get: (name: string) => cookieStore.get(name)?.value,
      set: (name: string, value: string, options) => {
        cookieStore.set({ name, value, ...options });
      },
      remove: (name: string, options) => {
        cookieStore.set({ name, value: '', ...options, maxAge: 0 });
      },
    },
  });
}
