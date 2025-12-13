import { supabase } from '@/lib/supabase/client';

const BUCKET_ID = 'profile-images';

export const updateProfileImage = async (blob: Blob): Promise<string> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const user = userData.user;
  if (!user) {
    throw new Error('ログインが必要です');
  }

  const previousUrl = (user.user_metadata as any)?.avatar_url as string | undefined;
  const filePath = `${user.id}/${Date.now()}.png`;

  const { error: uploadError } = await supabase.storage.from(BUCKET_ID).upload(filePath, blob, {
    cacheControl: '3600',
    upsert: true,
    contentType: 'image/png',
  });

  if (uploadError) {
    throw uploadError;
  }

  const { data: publicUrlData } = supabase.storage.from(BUCKET_ID).getPublicUrl(filePath);
  const publicUrl = publicUrlData.publicUrl;

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(
      [
        {
          id: user.id,
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        },
      ] as any,
    );

  if (profileError) {
    throw profileError;
  }

  const { error: authError } = await supabase.auth.updateUser({
    data: { avatar_url: publicUrl },
  });

  if (authError) {
    throw authError;
  }

  if (previousUrl && previousUrl !== publicUrl && previousUrl.includes(`${BUCKET_ID}/`)) {
    const existingPath = previousUrl.split(`${BUCKET_ID}/`)[1];
    if (existingPath) {
      await supabase.storage.from(BUCKET_ID).remove([existingPath]);
    }
  }

  return publicUrl;
};
