import { supabase } from '@/libs/supabase/client';
import { ItemInput } from '../schema';
// v4 UUID import removed as it is used in uploadImage now (or strictly not needed here if input doesn't need it for ID)
// But wait, createItem logic in previous file uploaded images too.
// The input `files: File[]` implies we handle uploads here OR in hook.
// The plan said: "Implement onSubmit handler that: 1. Uploads images... 2. Calls createItem with URL list."
// So createItem should strictly take URL list, NOT File[].
// BUT, the previous createItem took File[].
// Let's align with the Plan: "Implement createItem function calling supabase...insert...".
// The hook will handle upload.
// So createItem should just take ItemInput which includes images: string[].

export const createItem = async (input: ItemInput, userId: string) => {
  // Images are already strings in input.images
  const { data, error } = await supabase
    .from('items')
    .insert({
      user_id: userId,
      title: input.title,
      description: input.description,
      price: input.price,
      category: input.category,
      images: input.images, // JSONB array of strings/objects
      status: input.status,
    } as any)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};


