import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/features/user/hooks/useAuth';
import { getItems } from '@/features/items/api/getItems';
import { deleteItem } from '@/features/items/api/deleteItem';
import { Item } from '@/features/items/types';

type AdminDashboardProps = {
  onNavigate: (page: string) => void;
};

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Simple Admin Check (For MVP, check email or metadata)
  // In production, this should be robust RLS or Edge Function
  const isAdmin = user?.email === 'admin@example.com' || user?.user_metadata?.role === 'admin';

  useEffect(() => {
    if (user && isAdmin) {
      fetchItems();
    }
  }, [user, isAdmin]);

  const fetchItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('管理者権限で削除しますか？')) return;
    try {
      await deleteItem(itemId);
      setItems(prev => prev.filter(i => i.id !== itemId));
      alert('削除しました');
    } catch (e) {
      console.error(e);
      alert('削除に失敗しました');
    }
  };

  if (!user || !isAdmin) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <p>管理者権限がありません</p>
            <button onClick={() => onNavigate('home')} className="ml-4 text-primary">ホームへ戻る</button>
        </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-background">
      <Header title="管理者ダッシュボード" onNavigate={onNavigate} />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-xl mb-4 text-primary">全商品管理</h2>

        {loading ? (
            <div>Loading...</div>
        ) : (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted text-secondary">
                        <tr>
                            <th className="p-3">ID</th>
                            <th className="p-3">Title</th>
                            <th className="p-3">Seller</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id} className="border-t border-border hover:bg-muted/50">
                                <td className="p-3 text-xs font-mono">{item.id.slice(0, 8)}...</td>
                                <td className="p-3">{item.title}</td>
                                <td className="p-3">{item.user?.name || 'Unknown'}</td>
                                <td className="p-3">{item.status}</td>
                                <td className="p-3">
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="text-destructive hover:underline"
                                    >
                                        削除
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </main>
    </div>
  );
}
