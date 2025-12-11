'use server';

import { redirect } from 'next/navigation';
import { createServerClientInstance } from '@/app/lib/supabase/server-client';
import { requireAdminUser } from '@/app/lib/auth/require-admin';

export async function updateItemStatus(formData: FormData) {
  await requireAdminUser();
  const itemId = formData.get('itemId') as string | null;
  const status = formData.get('status') as string | null;

  if (!itemId || !status) {
    return { error: '必要なパラメータが不足しています' };
  }

  const supabase = createServerClientInstance();
  const { error } = await supabase.from('items').update({ status }).eq('id', itemId);

  if (error) {
    console.error('updateItemStatus failed', error);
    return { error: 'ステータス更新に失敗しました' };
  }

  redirect('/admin/items');
}
