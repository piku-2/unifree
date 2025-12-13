import { supabase } from '@/lib/supabase/client';
import { ChatRoom } from '../types';

export const getChatRooms = async (userId: string): Promise<any[]> => {
  type Profile = {
    id?: string;
    username?: string | null;
    name?: string | null;
    avatar_url?: string | null;
  };

  // Fetch rooms where user is buyer or seller
  const { data, error } = await supabase
    .from('chat_rooms')
    .select(`
      *,
      item:items(title, images),
      buyer:profiles!buyer_id(id, username, avatar_url),
      seller:profiles!seller_id(id, username, avatar_url),
      last_message:messages(order:created_at.desc, limit:1, content, created_at, is_read)
    `)
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('updated_at', { ascending: false });

  if (error) {
    throw error;
  }

  const rooms = (data ?? []) as Array<{
    buyer?: Profile;
    seller?: Profile;
    last_message?: { content?: string; created_at?: string; is_read?: boolean }[];
  }>;

  return rooms.map((room) => ({
    ...room,
    buyer: room.buyer
      ? {
          ...room.buyer,
          name: room.buyer.username ?? room.buyer.name ?? undefined,
        }
      : undefined,
    seller: room.seller
      ? {
          ...room.seller,
          name: room.seller.username ?? room.seller.name ?? undefined,
        }
      : undefined,
  }));
};
