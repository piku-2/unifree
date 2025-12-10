import { supabase } from '@/libs/supabase/client';
import { Database } from '@/libs/supabase/types';

type ItemInsert = Database['public']['Tables']['items']['Insert'];

export const createItem = async (item: Omit<ItemInsert, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('items')
    .insert(item as any)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};
