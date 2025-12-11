'use server';

import { createServerClientInstance } from '@/app/lib/supabase/server-client';

const defaultRedirectBase =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export async function loginWithGoogle() {
  const supabase = createServerClientInstance();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${defaultRedirectBase}/auth/callback`,
      queryParams: { hd: 'ac.jp' },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { url: data?.url ?? null };
}

export async function loginWithEmail(formData: FormData) {
  const email = formData.get('email');
  if (!email || typeof email !== 'string') {
    return { error: 'メールアドレスを入力してください' };
  }
  if (!email.endsWith('.ac.jp')) {
    return { error: '大学ドメイン（@xxx.ac.jp）のメールアドレスのみ利用できます' };
  }

  const supabase = createServerClientInstance();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${defaultRedirectBase}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function logout() {
  const supabase = createServerClientInstance();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error: error.message };
  }
  return { success: true };
}
