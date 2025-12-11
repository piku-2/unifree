import { requireAdminUser } from '@/app/lib/auth/require-admin';
import { createServerClientInstance } from '@/app/lib/supabase/server-client';
import { updateItemStatus } from '@/app/actions/admin/update-item-status';

type Item = {
  id: string;
  title: string;
  status: string;
  price: number;
  owner_id: string | null;
  image_url: string | null;
  owner: {
    username: string | null;
  } | null;
};

export const dynamic = 'force-dynamic';

export default async function AdminItemsPage() {
  await requireAdminUser();
  const supabase = createServerClientInstance();

  const { data: items, error } = await supabase
    .from('items')
    .select('id, title, status, price, owner_id, image_url, owner:profiles(username)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('admin items fetch failed', error);
  }

  const allItems: Item[] = items ?? [];

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-primary font-semibold">商品管理</h1>
            <p className="text-sm text-secondary">全商品のステータスを管理します。</p>
          </div>
        </div>

        <div className="overflow-x-auto border border-border rounded-lg bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted text-secondary">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">タイトル</th>
                <th className="p-3 text-left">出品者</th>
                <th className="p-3 text-left">価格</th>
                <th className="p-3 text-left">ステータス</th>
                <th className="p-3 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {allItems.map((item) => (
                <tr key={item.id} className="border-t border-border hover:bg-muted/50">
                  <td className="p-3 font-mono text-xs">{item.id}</td>
                  <td className="p-3">{item.title}</td>
                  <td className="p-3">{item.owner?.username ?? item.owner_id ?? 'N/A'}</td>
                  <td className="p-3">{new Intl.NumberFormat('ja-JP').format(item.price)}円</td>
                  <td className="p-3">{item.status}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {['selling', 'reserved', 'sold'].map((status) => (
                        <form key={status} action={updateItemStatus}>
                          <input type="hidden" name="itemId" value={item.id} />
                          <input type="hidden" name="status" value={status} />
                          <button
                            type="submit"
                            className="px-3 py-1 border border-border rounded hover:border-primary text-xs"
                          >
                            {status}
                          </button>
                        </form>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {allItems.length === 0 && (
                <tr>
                  <td className="p-4 text-center text-secondary" colSpan={6}>
                    商品がありません。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
