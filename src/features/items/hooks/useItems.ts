import { useEffect, useState } from 'react';
import { ItemWithUser } from '../types';

import { getItems } from '../api/getItems';
import { supabase } from '@/lib/supabase/client';

export function useItems() {
  const [items, setItems] = useState<ItemWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('SESSION_CHECK:', session);
    });
    getItems()
      .then(data => setItems(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { items, loading, error };
}
