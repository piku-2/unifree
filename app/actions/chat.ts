'use server';

import { supabaseServerClient } from '../../lib/supabase/server';

export async function startChat(itemId: number | string) {
  const supabase = supabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error('認証が必要です。');

  const { data: item, error: itemError } = await supabase
    .from('items')
    .select('id, owner_id')
    .eq('id', itemId)
    .single();
  if (itemError) throw itemError;
  if (!item) throw new Error('商品が見つかりません。');

  const buyerId = user.id;
  const sellerId = item.owner_id;
  if (buyerId === sellerId) throw new Error('自身の出品にはチャットできません。');

  const { data: existing } = await supabase
    .from('chat_rooms')
    .select('id')
    .eq('item_id', item.id)
    .eq('buyer_id', buyerId)
    .eq('seller_id', sellerId)
    .maybeSingle();

  if (existing?.id) {
    return existing.id;
  }

  const { data: created, error: createError } = await supabase
    .from('chat_rooms')
    .insert({
      item_id: item.id,
      buyer_id: buyerId,
      seller_id: sellerId,
    })
    .select('id')
    .single();

  if (createError) throw createError;
  return created.id;
}

export async function sendMessage(roomId: number | string, content: string) {
  const supabase = supabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error('認証が必要です。');

  const { data: room, error: roomError } = await supabase
    .from('chat_rooms')
    .select('id, buyer_id, seller_id')
    .eq('id', roomId)
    .single();
  if (roomError) throw roomError;
  if (!room) throw new Error('チャットルームが見つかりません。');

  if (room.buyer_id !== user.id && room.seller_id !== user.id) {
    throw new Error('このチャットに参加していません。');
  }

  const { error } = await supabase.from('messages').insert({
    room_id: room.id,
    sender_id: user.id,
    content,
  });
  if (error) throw error;
}
