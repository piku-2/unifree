import Link from 'next/link';
import { requireAdminUser } from '@/app/lib/auth/require-admin';
import { createServerClientInstance } from '@/app/lib/supabase/server-client';
import { updateOrderStatus } from '@/app/actions/admin/update-order-status';

type OrderRow = {
  id: string;
  item_id: string;
  created_at: string | null;
  item: {
    id: string;
    title: string;
    status: string;
    image_url: string | null;
  } | null;
  buyer: { username: string | null } | null;
  seller: { username: string | null } | null;
};

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  await requireAdminUser();
  const supabase = createServerClientInstance();

  const { data: rooms, error } = await supabase
    .from('chat_rooms')
    .select(
      'id, item_id, created_at, item:items(id, title, status, image_url), buyer:profiles!buyer_id(username), seller:profiles!seller_id(username)',
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('admin orders fetch failed', error);
  }

  const orders: OrderRow[] = rooms ?? [];

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-primary font-semibold">取引管理</h1>
            <p className="text-sm text-secondary">購入申請/チャットルームの一覧とステータス操作</p>
          </div>
          <Link href="/admin" className="text-sm text-primary hover:underline">
            管理トップへ
          </Link>
        </div>

        <div className="overflow-x-auto border border-border rounded-lg bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted text-secondary">
              <tr>
                <th className="p-3 text-left">Room</th>
                <th className="p-3 text-left">商品</th>
                <th className="p-3 text-left">Buyer</th>
                <th className="p-3 text-left">Seller</th>
                <th className="p-3 text-left">ステータス</th>
                <th className="p-3 text-left">操作</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-border hover:bg-muted/50">
                  <td className="p-3 font-mono text-xs">
                    <Link href={`/chat/${order.id}`} className="text-primary hover:underline">
                      {order.id}
                    </Link>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded bg-muted border border-border overflow-hidden flex items-center justify-center">
                        {order.item?.image_url ? (
                          <img src={order.item.image_url} alt={order.item.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-secondary text-[10px]">No image</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-foreground font-semibold">{order.item?.title ?? 'N/A'}</p>
                        <p className="text-xs text-secondary">{order.created_at ?? ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{order.buyer?.username ?? 'buyer'}</td>
                  <td className="p-3">{order.seller?.username ?? 'seller'}</td>
                  <td className="p-3">{order.item?.status ?? 'unknown'}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {['selling', 'reserved', 'sold'].map((status) => (
                        <form key={status} action={updateOrderStatus}>
                          <input type="hidden" name="roomId" value={order.id} />
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
              {orders.length === 0 && (
                <tr>
                  <td className="p-4 text-center text-secondary" colSpan={6}>
                    取引データがありません。
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
