import { useState } from 'react';
import { supabase } from '@/libs/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export function useProfileImage() {
  const [uploading, setUploading] = useState(false);

  const uploadProfileImage = async (userId: string, file: Blob) => {
    try {
      setUploading(true);

      const fileExt = file.type.split('/')[1] || 'jpeg';
      const fileName = `${userId}/${uuidv4()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const publicUrl = data.publicUrl;

      // 1. Update profiles table
      const { error: updateTableError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateTableError) {
        // If profile doesn't exist, maybe insert?
        // For now, assume profile created on trigger or login.
        // If not, we might need upsert.
        // Let's try upsert to be safe.
        const { error: upsertError } = await supabase
          .from('profiles')
          .upsert({
             id: userId,
             avatar_url: publicUrl,
             updated_at: new Date().toISOString()
          });

        if (upsertError) throw upsertError;
      }

      // 2. Update Auth Metadata (User Metadata)
      const { error: updateAuthError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateAuthError) {
        throw updateAuthError;
      }

      return publicUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadProfileImage,
    uploading,
  };
}
