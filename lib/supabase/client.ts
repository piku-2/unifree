import { createBrowserClient } from '@supabase/ssr';
import { Database } from '../../supabase/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set.');
}

export const supabaseBrowserClient = () =>
  createBrowserClient<Database>(supabaseUrl ?? '', supabaseAnonKey ?? '');
