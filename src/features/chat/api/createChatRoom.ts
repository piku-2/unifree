import { supabase } from '@/lib/supabase/client';
import { ChatRoom } from '../types';

export const createChatRoom = async (itemId: string, buyerId: string, sellerId: string): Promise<string> => {
  // 1. Check if room exists
  const { data: existingRooms, error: fetchError } = await supabase
    .from('chat_rooms')
    .select('id')
    .eq('item_id', itemId)
    .eq('buyer_id', buyerId)
    .eq('seller_id', sellerId)
    .limit(1);

  if (fetchError) {
    throw fetchError;
  }

  if (existingRooms && existingRooms.length > 0) {
    return (existingRooms[0] as { id: string }).id;
  }

  // 2. Create new room
  const { data: newRoom, error: createError } = await supabase
    .from('chat_rooms')
    .insert({
      item_id: itemId,
      buyer_id: buyerId,
      seller_id: sellerId,
    } as any)
    .select('id')
    .single();

  if (createError) {
    throw createError;
  }

  if (!newRoom) {
    throw new Error('Failed to create chat room');
  }

  return (newRoom as { id: string }).id;
};
