import { supabase } from '@/libs/supabase/client';

export const sendMessage = async (roomId: string, senderId: string, content: string) => {
  const { error } = await supabase
    .from('messages')
    .insert({
      room_id: roomId,
      sender_id: senderId,
      content,
    });

  if (error) {
    throw error;
  }

  // Update room updated_at
  await supabase
    .from('chat_rooms')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', roomId);
};
