import { supabase } from '@/libs/supabase/client';

export const deleteItem = async (itemId: string) => {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', itemId);

  if (error) {
    throw error;
  }
};
