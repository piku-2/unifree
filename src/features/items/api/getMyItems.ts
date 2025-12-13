import { supabase } from '@/lib/supabase/client';
import { Item } from '../types';

export const getMyItems = async (userId: string): Promise<Item[]> => {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .or(`owner_id.eq.${userId},user_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as Item[];
};
