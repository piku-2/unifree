import { supabase } from '@/lib/supabase/client';
import { ItemInput } from '../schema';

export const updateItem = async (itemId: string, input: ItemInput) => {
  const { data, error } = await supabase
    .from('items')
    // @ts-ignore
    .update({
      title: input.title,
      description: input.description,
      price: input.price,
      category: input.category,
      images: input.images,
      status: input.status,
    } as any)  // images logic separate or handled here if input includes image URLs
    .eq('id', itemId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};
