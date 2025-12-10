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
        const { data, error } = await supabase
            .from('items')
            .select('*, user:users(name, avatar_url, department)')
            .eq('id', itemId)
            .single();

        if (error) throw error;
        setItem(data as any as ItemWithUser);
    };

    fetchItem()
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [itemId]);

  return { item, loading, error };
}
