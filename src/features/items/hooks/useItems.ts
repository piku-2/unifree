import { useEffect, useState } from 'react';
import { ItemWithUser } from '../types';
import { getItems } from '../api/getItems';

export function useItems() {
  const [items, setItems] = useState<ItemWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getItems()
      .then(data => setItems(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { items, loading, error };
}
