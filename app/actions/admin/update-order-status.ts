'use server';

import { redirect } from 'next/navigation';
import { createServerClientInstance } from '@/app/lib/supabase/server-client';
import { requireAdminUser } from '@/app/lib/auth/require-admin';

export async function updateOrderStatus(formData: FormData) {
  await requireAdminUser();
  const roomId = formData.get('roomId') as string | null;
  const status = formData.get('status') as string | null;

  if (!roomId || !status) {
    return { error: '必要なパラメータが不足しています' };
  }

  const supabase = createServerClientInstance();

  const { data: room, error: roomError } = await supabase
    .from('chat_rooms')
    .select('item_id')
    .eq('id', roomId)
    .maybeSingle();

  if (roomError || !room) {
    console.error('updateOrderStatus: room fetch failed', roomError);
    return { error: 'チャットルームが見つかりません' };
  }

  const { error: updateError } = await supabase.from('items').update({ status }).eq('id', room.item_id);

  if (updateError) {
    console.error('updateOrderStatus: item update failed', updateError);
    return { error: 'ステータス更新に失敗しました' };
  }

  redirect('/admin/orders');
}
