'use server';

import { redirect } from 'next/navigation';
import { getServerUser } from '@/app/lib/supabase/get-server-user';

export async function requireServerUser() {
  const user = await getServerUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}
