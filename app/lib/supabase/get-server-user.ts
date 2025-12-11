'use server';

import { User } from '@supabase/supabase-js';
import { createServerClientInstance } from './server-client';

export async function getServerUser(): Promise<User | null> {
  const supabase = createServerClientInstance();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    // For server components, prefer silent fail to avoid rendering breakage
    console.error('getServerUser error', error);
    return null;
  }
  return data.user ?? null;
}
