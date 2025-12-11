'use server';

import { redirect } from 'next/navigation';
import { requireServerUser } from './require-auth';

export async function requireAdminUser() {
  const user = await requireServerUser();
  const role = (user.user_metadata as Record<string, any> | undefined)?.role;
  const isAdmin = role === 'admin' || user.email === 'admin@example.com';
  if (!isAdmin) {
    redirect('/login');
  }
  return user;
}
