'use server';

import { createServerClientInstance } from '@/app/lib/supabase/server-client';
import { requireServerUser } from '@/app/lib/auth/require-auth';

export async function sendMessage(roomId: string, message: string) {
  const user = await requireServerUser();
  const content = message.trim();
  if (!content) {
    return { error: 'メッセージを入力してください' };
  }

  const supabase = createServerClientInstance();

  const { data: room, error: roomError } = await supabase
    .from('chat_rooms')
    .select('id, buyer_id, seller_id')
    .eq('id', roomId)
    .maybeSingle();

  if (roomError) {
    console.error('sendMessage: failed to fetch room', roomError);
    return { error: 'チャットルームの取得に失敗しました' };
  }

  if (!room || (room.buyer_id !== user.id && room.seller_id !== user.id)) {
    return { error: 'チャットルームが見つかりません' };
  }

  const { error: insertError } = await supabase.from('messages').insert({
    room_id: roomId,
    sender_id: user.id,
    content,
    is_read: false,
  });

  if (insertError) {
    console.error('sendMessage: failed to insert message', insertError);
    return { error: 'メッセージ送信に失敗しました' };
  }

  return { ok: true };
}
