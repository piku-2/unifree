import { supabase } from '@/libs/supabase/client';
import { ChatRoom } from '../types';

export const getChatRooms = async (userId: string): Promise<any[]> => {
  // Fetch rooms where user is buyer or seller
  const { data, error } = await supabase
    .from('chat_rooms')
    .select(`
      *,
      item:items(title, images),
      buyer:users!buyer_id(name, avatar_url),
      seller:users!seller_id(name, avatar_url),
      last_message:messages(content, created_at, is_read)
    `)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('updated_at', { ascending: false });

  if (error) {
    throw error;
  }

  // Note: last_message needs special handling usually (limit 1 desc), but supabase simple join returns all.
  // For MVP, if messages are joined, we might get array. We need to process this.
  // Ideally we use a view or robust query. For now, assuming simple fetch for list.
  return data;
};
