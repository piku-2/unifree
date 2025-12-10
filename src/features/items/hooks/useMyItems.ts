import { useEffect, useState, useCallback } from 'react';
import { Item } from '../types';
import { getMyItems } from '../api/getMyItems';
import { deleteItem } from '../api/deleteItem';
import { useAuth } from '@/features/user/hooks/useAuth';

export function useMyItems() {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchItems = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getMyItems(user.id);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDelete = async (itemId: string) => {
    if (!confirm('本当に削除しますか？')) return;
    try {
      await deleteItem(itemId);
      setItems(prev => prev.filter(i => i.id !== itemId));
    } catch (err) {
      alert('削除に失敗しました');
      console.error(err);
    }
  };

  return { items, loading, error, handleDelete, refresh: fetchItems };
}
