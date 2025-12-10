import { supabase } from '@/libs/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export const uploadImage = async (file: File, userId: string): Promise<string> => {
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
};
