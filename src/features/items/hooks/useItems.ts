import { useEffect, useState } from 'react';
import { Item } from '../types';
import { getItems } from '../api/getItems';

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchItems() {
      try {
        const data = await getItems();
        if (mounted) {
          setItems(data);
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

    fetchItems();

    return () => {
      mounted = false;
    };
  }, []);

  return { items, loading, error };
}
