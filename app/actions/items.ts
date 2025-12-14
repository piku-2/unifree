'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServerClient } from '../../lib/supabase/server';
import { Database } from '../../supabase/types';
import { handleSupabaseError } from './error';

type ItemFilters = {
  category?: string;
};

type ItemWithOwner = Database['public']['Tables']['items']['Row'] & {
  owner?: Pick<Database['public']['Tables']['profiles']['Row'], 'id' | 'username' | 'avatar_url'> | null;
};

export async function createItem(formData: FormData) {
  const supabase = supabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error('認証が必要です。');

  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const category = String(formData.get('category') ?? '').trim();
  const priceRaw = formData.get('price');
  const price = Number(typeof priceRaw === 'string' ? priceRaw.trim() : priceRaw);
  const status = (formData.get('status') as Database['public']['Tables']['items']['Row']['status']) ?? 'selling';

  if (!title || !description || !category || !Number.isFinite(price)) {
    throw new Error('必須項目が不足しています。');
  }

  const image = formData.get('image');
  if (!(image instanceof File) || image.size === 0) {
    throw new Error('商品画像を1枚アップロードしてください。');
  }
  if (image.type && !image.type.startsWith('image/')) {
    throw new Error('画像ファイルを指定してください。');
  }

  const ext = image.name.split('.').pop() || 'jpg';
  const path = `${user.id}/${Date.now()}.${ext}`;
  const { error: uploadError } = await supabase.storage.from('items').upload(path, image);
  if (uploadError) handleSupabaseError(uploadError);
  const { data: publicUrlData } = supabase.storage.from('items').getPublicUrl(path);
  const imageUrl = publicUrlData.publicUrl;

  const { data, error } = await supabase
    .from('items')
    .insert(
      [
        {
          owner_id: user.id,
          title,
          description,
          price,
          category,
          status: status ?? 'selling',
          image_url: imageUrl,
          images: [imageUrl],
        },
      ] as any,
    )
    .select()
    .single();

  if (error) handleSupabaseError(error);

  revalidatePath('/');
  return data;
}

export async function getItems(filters: ItemFilters = {}) {
  const supabase = supabaseServerClient();
  let query = supabase.from('items').select('*').order('created_at', { ascending: false });
  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  const { data, error } = await query;
  if (error) handleSupabaseError(error);
  return data;
}

export async function getItem(id: number | string): Promise<ItemWithOwner | null> {
  const supabase = supabaseServerClient();
  const itemId = String(id);
  const { data, error } = await supabase
    .from('items')
    .select(
      `
        *,
        owner:profiles!items_owner_id_fkey (
          id,
          username,
          avatar_url
        )
      `,
    )
    .eq('id', itemId)
    .maybeSingle<ItemWithOwner>();
  if (error) handleSupabaseError(error);
  return data ?? null;
}
