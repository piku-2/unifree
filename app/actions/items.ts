'use server';

import { revalidatePath } from 'next/cache';
import { supabaseServerClient } from '../../lib/supabase/server';
import { Database } from '../../supabase/types';

type ItemFilters = {
  category?: string;
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
  const price = Number(formData.get('price'));
  const status = (formData.get('status') as Database['public']['Tables']['items']['Row']['status']) ?? 'selling';

  if (!title || !description || !category || !Number.isFinite(price)) {
    throw new Error('必須項目が不足しています。');
  }

  let imageUrl: string | null = null;
  const image = formData.get('image');
  if (image instanceof File && image.size > 0) {
    const ext = image.name.split('.').pop() || 'jpg';
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('items').upload(path, image);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('items').getPublicUrl(path);
    imageUrl = data.publicUrl;
  }

  const { data, error } = await supabase
    .from('items')
    .insert({
      owner_id: user.id,
      title,
      description,
      price,
      category,
      status: status ?? 'selling',
      image_url: imageUrl,
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath('/');
  revalidatePath('/items');
  return data;
}

export async function getItems(filters: ItemFilters = {}) {
  const supabase = supabaseServerClient();
  let query = supabase.from('items').select('*').order('created_at', { ascending: false });
  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getItem(id: number | string) {
  const supabase = supabaseServerClient();
  const { data, error } = await supabase.from('items').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}
