import { supabase } from '@/lib/supabase/client';

export const toggleLike = async (itemId: string, userId: string): Promise<boolean> => {
  // Check if already liked
  const { data } = await supabase
    .from('likes')
    // @ts-ignore
    .select('id')
    .eq('item_id', itemId)
    .eq('user_id', userId)
    .single();

  if (data) {
    // Delete
    // @ts-ignore
    await supabase.from('likes').delete().eq('id', (data as any).id);
    return false;
  } else {
    // Insert
    // @ts-ignore
    await supabase.from('likes').insert({ item_id: itemId, user_id: userId });
    return true;
  }
};

export const getLikeStatus = async (itemId: string, userId: string): Promise<boolean> => {
    const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('item_id', itemId)
    .eq('user_id', userId)
    .single();
    return !!data;
};
