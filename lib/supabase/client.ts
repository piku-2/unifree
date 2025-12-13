import { createBrowserClient } from '@supabase/ssr';
import { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type SupabaseBrowserClient = ReturnType<typeof createBrowserClient<Database>>;

const globalForSupabase = globalThis as typeof globalThis & {
  __supabaseBrowserClient?: SupabaseBrowserClient;
};

export const getSupabaseBrowserClient = () => {
  if (globalForSupabase.__supabaseBrowserClient) {
    return globalForSupabase.__supabaseBrowserClient;
  }

  const client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    cookieOptions: {
      name: 'sb-access-token',
    },
    isSingleton: true,
  });

  globalForSupabase.__supabaseBrowserClient = client;
  return client;
};

// PKCE + cookie-based auth flow
export const supabase = getSupabaseBrowserClient();
