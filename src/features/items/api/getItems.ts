import { supabase } from '@/lib/supabase/client';
import { Item, ItemWithUser } from '../types';

export const getItems = async (): Promise<ItemWithUser[]> => {
  type ItemRow = Item & {
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
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data as ItemRow[] | null)?.map(({ owner, ...rest }) => ({
    ...rest,
    user: owner
      ? {
          id: owner.id,
          username: owner.username,
          name: owner.username ?? undefined,
          avatar_url: owner.avatar_url ?? undefined,
        }
      : undefined,
  })) ?? [];
};
