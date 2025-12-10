import { supabase } from '@/libs/supabase/client';
import { Item } from '../types';

export const getItems = async (): Promise<Item[]> => {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as Item[];
};
