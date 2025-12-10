import { supabase } from '@/libs/supabase/client';
import { ItemInput } from '../schema';
import { v4 as uuidv4 } from 'uuid';

export const createItem = async (input: ItemInput, files: File[], userId: string) => {
  // 1. Upload images
  const uploadPromises = files.map(async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${uuidv4()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('items')
      .upload(fileName, file);

    if (uploadError) {
        throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('items')
      .getPublicUrl(fileName);

    return publicUrl;
  });

  const imageUrls = await Promise.all(uploadPromises);

  // 2. Insert item
  const { data, error } = await supabase
    .from('items')
    .insert({
      user_id: userId,
      title: input.title,
      description: input.description,
      price: input.price,
      category: input.category,
      images: imageUrls,
      status: input.status,
      // condition: input.condition // If schema extended
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};
