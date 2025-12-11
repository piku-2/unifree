'use server';

import { randomUUID } from 'crypto';
import { redirect } from 'next/navigation';
import { createServerClientInstance } from '@/app/lib/supabase/server-client';
import { requireServerUser } from '@/app/lib/auth/require-auth';

export async function updateProfile(formData: FormData) {
  const user = await requireServerUser();
  const supabase = createServerClientInstance();

  const username = (formData.get('username') as string | null)?.trim() ?? '';
  if (!username) {
    return { error: 'ユーザー名を入力してください' };
  }

  const file = formData.get('avatar');
  let avatarUrl: string | null = null;

  if (file && file instanceof File && file.size > 0) {
    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `avatars/${user.id}/${randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        contentType: file.type || 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      console.error('updateProfile: upload failed', uploadError);
      return { error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    avatarUrl = publicUrlData.publicUrl;
  }

  const updates: { username: string; avatar_url?: string | null } = { username };
  if (avatarUrl) {
    updates.avatar_url = avatarUrl;
  }

  const { error: updateError } = await supabase.from('profiles').update(updates).eq('id', user.id);

  if (updateError) {
    console.error('updateProfile: profile update failed', updateError);
    return { error: updateError.message };
  }

  redirect('/mypage');
}
