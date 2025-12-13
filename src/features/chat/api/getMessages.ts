import { supabase } from '@/lib/supabase/client';
import { Message } from '../types';

export const getMessages = async (roomId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
};
