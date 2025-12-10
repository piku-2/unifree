import { supabase } from '@/libs/supabase/client';
import { ItemInput } from '../schema';

export const updateItem = async (itemId: string, input: ItemInput) => {
  const { data, error } = await supabase
    .from('items')
    .update({
      title: input.title,
      description: input.description,
      price: input.price,
      category: input.category,
      status: input.status,
      // images logic separate or handled here if input includes image URLs
    })
    .eq('id', itemId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};
