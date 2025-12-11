'use server';

import { notFound, redirect } from 'next/navigation';
import { createServerClientInstance } from '@/app/lib/supabase/server-client';
import { requireServerUser } from '@/app/lib/auth/require-auth';

export async function startChat(itemId: string) {
  const buyer = await requireServerUser();
  const supabase = createServerClientInstance();

  const { data: item, error: itemError } = await supabase
    .from('items')
    .select('id, owner_id, status')
    .eq('id', itemId)
    .maybeSingle();

  if (itemError) {
    console.error('startChat: failed to fetch item', itemError);
    notFound();
  }

  if (!item) {
    notFound();
  }

  if (!item.owner_id) {
    throw new Error('出品者情報が不足しています');
  }

  const sellerId = item.owner_id;

  const { data: existingRoom, error: roomFetchError } = await supabase
    .from('chat_rooms')
    .select('id')
    .eq('item_id', item.id)
    .eq('buyer_id', buyer.id)
    .eq('seller_id', sellerId)
    .maybeSingle();

  if (roomFetchError) {
    console.error('startChat: failed to fetch existing room', roomFetchError);
    throw new Error('チャットルームの取得に失敗しました');
  }

  let roomId = existingRoom?.id;

  if (!roomId) {
    const { data: newRoom, error: createRoomError } = await supabase
      .from('chat_rooms')
      .insert({
        item_id: item.id,
        buyer_id: buyer.id,
        seller_id: sellerId,
      })
      .select('id')
      .single();

    if (createRoomError || !newRoom) {
      console.error('startChat: failed to create room', createRoomError);
      throw new Error('チャットルームの作成に失敗しました');
    }

    roomId = newRoom.id;
  }

  if (item.status === 'selling') {
    const { error: updateError } = await supabase
      .from('items')
      .update({ status: 'reserved' })
      .eq('id', item.id);

    if (updateError) {
      console.error('startChat: failed to update item status', updateError);
      throw new Error('商品のステータス更新に失敗しました');
    }
  }

  redirect(`/chat/${roomId}`);
}
