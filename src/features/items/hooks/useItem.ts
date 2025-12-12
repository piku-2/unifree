import { useEffect, useState } from 'react';
import { ItemWithUser } from '../types';
import { supabase } from '@/libs/supabase/client';

export function useItem(itemId: string) {
  const [item, setItem] = useState<ItemWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!itemId) {
        setLoading(false);
        return;
    }

    const fetchItem = async () => {
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
            .eq('id', itemId)
            .single();

        if (error) throw error;
        const { owner, ...rest } = data as ItemRow;
        setItem({
          ...rest,
          user: owner
            ? {
                id: owner.id,
                username: owner.username,
                name: owner.username ?? undefined,
                avatar_url: owner.avatar_url ?? undefined,
              }
            : undefined,
        });
    };

    fetchItem()
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [itemId]);

  return { item, loading, error };
}
