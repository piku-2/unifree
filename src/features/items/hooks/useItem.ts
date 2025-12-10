import { useEffect, useState } from 'react';
import { ItemWithUser } from '../types';
import { getItem } from '../api/getItem';

export function useItem(itemId: string) {
  const [item, setItem] = useState<ItemWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchItem() {
      try {
        setLoading(true);
        const data = await getItem(itemId);
        if (mounted) {
          setItem(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('An error occurred'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (itemId) {
      fetchItem();
    } else {
        setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [itemId]);

  return { item, loading, error };
}
