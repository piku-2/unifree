'use server';

import { supabaseServerClient } from '../../lib/supabase/server';

type AdminCreateItemInput = {
  title: string;
  description: string;
  price: number;
  category: string;
  status?: 'selling' | 'reserved' | 'sold';
  image_url?: string | null;
  owner_id?: string;
};

export async function adminCreateItem(input: AdminCreateItemInput) {
  const supabase = supabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error('認証が必要です。');

  const role = (user.app_metadata as any)?.role;
  if (role !== 'admin') throw new Error('管理者権限が必要です。');

  const payload = {
    owner_id: input.owner_id ?? user.id,
    title: input.title.trim(),
    description: input.description.trim(),
    price: input.price,
    category: input.category.trim(),
    status: input.status ?? 'selling',
    image_url: input.image_url ?? null,
  };

  const { data, error } = await supabase.from('items').insert(payload).select().single();
  if (error) throw error;
  return data;
}
