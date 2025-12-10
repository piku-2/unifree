import { supabase } from '@/libs/supabase/client';
import { Item } from '../types';

export const getLikedItems = async (userId: string): Promise<Item[]> => {
  const { data, error } = await supabase
    .from('likes')
    .select('item:items(*)') // Join items
    .eq('user_id', userId);

  if (error) throw error;

  // Transform data: data is array of { item: Item }
  // We need to filter nulls and return Item[]
  // Casting for simplicity
  return data.map((d: any) => d.item).filter((i: any) => i !== null) as Item[];
};
