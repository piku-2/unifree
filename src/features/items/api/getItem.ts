import { supabase } from '@/lib/supabase/client';
import { Item, ItemWithUser } from '../types';

export const getItem = async (id: string): Promise<ItemWithUser> => {
  type ItemRow = ItemWithUser & {
    owner?: {
      id?: string;
      username?: string | null;
      avatar_url?: string | null;
    };
  };

  const { data, error } = await supabase
    .from('items')
    .select(`
      *,
      owner:profiles!items_owner_id_fkey (
        id,
        username,
        avatar_url
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  const { owner, ...rest } = data as ItemRow;

  return {
    ...rest,
    user: owner
      ? {
          id: owner.id,
          username: owner.username,
          name: owner.username ?? undefined,
          avatar_url: owner.avatar_url ?? undefined,
        }
      : undefined,
  };
};
