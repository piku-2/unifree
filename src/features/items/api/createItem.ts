import { supabase } from '@/libs/supabase/client';
import { Database } from '@/libs/supabase/types';

type ItemInsert = Database['public']['Tables']['items']['Insert'];

type CreateItemInput = {
  title: string;
  description: string;
  price: number | string;
  category: string;
  image_url?: string | null;
  images?: string[] | null;
  status?: ItemInsert['status'];
  condition?: string | null;
  owner_id?: string | null;
  user_id?: string | null;
};

const normalizeStatus = (status?: ItemInsert['status']) => {
  if (status === 'on_sale') return 'selling';
  if (status === 'sold_out') return 'sold';
  if (status === 'trading') return 'reserved';
  return status ?? 'selling';
};

export const createItem = async (input: CreateItemInput) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const user = userData.user;

  if (!user) {
    throw new Error('ログインが必要です。/sell から出品してください。');
  }

  const title = (input.title ?? '').trim();
  const description = (input.description ?? '').trim();
  const category = (input.category ?? '').trim();

  if (!title) {
    throw new Error('タイトルは必須です');
  }
  if (!description) {
    throw new Error('説明は必須です');
  }
  if (!category) {
    throw new Error('カテゴリは必須です');
  }

  const priceValue = Number.parseInt(String(input.price), 10);
  if (!Number.isFinite(priceValue)) {
    throw new Error('価格は数値で入力してください');
  }
  if (priceValue < 100) {
    throw new Error('最低価格は100円です');
  }

  const imageUrl = input.image_url?.trim() || null;
  const status = normalizeStatus(input.status);

  const payload: ItemInsert = {
    title,
    description,
    category,
    price: priceValue,
    status,
    image_url: imageUrl,
    images: input.images && input.images.length ? input.images : imageUrl ? [imageUrl] : [],
    condition: input.condition ?? null,
    owner_id: user.id,
    user_id: user.id,
  };

  // RLS must allow inserts where owner_id = auth.uid()
  const { data, error } = await supabase
    .from('items')
    .insert([payload] as any) // 型不整合回避
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};
