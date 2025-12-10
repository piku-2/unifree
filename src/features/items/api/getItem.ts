import { supabase } from '@/libs/supabase/client';
import { Item, ItemWithUser } from '../types';

export const getItem = async (id: string): Promise<ItemWithUser> => {
  const { data, error } = await supabase
    .from('items')
    .select(`
      *,
      user:user_id (
        name,
        avatar_url
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  // Cast for now, complex types might need cleaner join handling
  // Supabase returns user as an object or array depending on relation
  // Assuming 1:1 or N:1 relation set up correctly in DB
  return data as unknown as ItemWithUser;
};
