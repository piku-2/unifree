import { supabase } from '@/libs/supabase/client';
import { Item, ItemWithUser } from '../types';

export const getItems = async (): Promise<ItemWithUser[]> => {
  const { data, error } = await supabase
    .from('items')
    .select('*, user:users(name, avatar_url)')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as any as Item[]; // Casting to Item[] or ItemWithUser[] depending on usage.
  // Ideally ItemWithUser. But generic Item often used.
  // I will update return type in signature too.
};
