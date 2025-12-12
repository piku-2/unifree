import { redirect } from 'next/navigation';
import Link from 'next/link';
import { supabaseServerClient } from '../../../lib/supabase/server';

export default async function AdminOrdersPage() {
  const supabase = supabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = (user?.app_metadata as any)?.role;
  if (!user || role !== 'admin') redirect('/');

  const { data: rooms } = await supabase
    .from('chat_rooms')
    .select('id,item_id,buyer_id,seller_id,created_at')
    .order('created_at', { ascending: false });

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">申請管理</h1>
      {rooms && rooms.length > 0 ? (
        <div className="space-y-2">
          {rooms.map((room) => (
            <div key={room.id} className="border rounded p-3">
              <p className="text-sm">Room: {room.id}</p>
              <p className="text-sm text-gray-600">Item: {room.item_id}</p>
              <p className="text-sm text-gray-600">Buyer: {room.buyer_id}</p>
              <p className="text-sm text-gray-600">Seller: {room.seller_id}</p>
              <Link href={`/chat/${room.id}`} className="text-blue-600 underline text-sm">
                チャットを開く
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">申請はまだありません。</p>
      )}
    </main>
  );
}
