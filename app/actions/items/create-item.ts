'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { createServerClientInstance } from '@/app/lib/supabase/server-client';
import { requireServerUser } from '@/app/lib/auth/require-auth';

const itemSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です'),
  description: z.string().min(1, '説明は必須です'),
  price: z.coerce.number().int().min(100, '価格は100円以上で設定してください'),
  category: z.string().min(1, 'カテゴリを選択してください'),
});

export async function createItem(formData: FormData) {
  const user = await requireServerUser();
  const parsed = itemSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    price: formData.get('price'),
    category: formData.get('category'),
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message || '入力内容を確認してください';
    throw new Error(message);
  }

  const file = formData.get('image');
  if (!file || !(file instanceof File) || file.size === 0) {
    throw new Error('画像を1枚アップロードしてください');
  }

  const supabase = createServerClientInstance();

  const ext = file.name.split('.').pop() || 'jpg';
  const filePath = `items/${user.id}/${randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('items')
    .upload(filePath, file, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: publicUrlData } = supabase.storage.from('items').getPublicUrl(filePath);
  const imageUrl = publicUrlData.publicUrl;

  const { error: insertError } = await supabase
    .from('items')
    .insert({
      owner_id: user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      price: parsed.data.price,
      category: parsed.data.category,
      image_url: imageUrl,
      status: 'selling',
    });

  if (insertError) {
    throw new Error(insertError.message);
  }

  redirect('/mypage');
}
