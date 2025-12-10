import { supabase } from '@/libs/supabase/client';
import { Item } from '../types';

export const getMyItems = async (userId: string): Promise<Item[]> => {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as Item[];
};
