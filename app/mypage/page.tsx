import { redirect } from 'next/navigation';
import Link from 'next/link';
import { supabaseServerClient } from '../../lib/supabase/server';

export default async function MyPage() {
  const supabase = supabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const [{ data: myItems }, { data: chatsAsBuyer }, { data: chatsAsSeller }] = await Promise.all([
    supabase.from('items').select('*').eq('owner_id', user.id).order('created_at', { ascending: false }),
    supabase.from('chat_rooms').select('id,item_id,created_at').eq('buyer_id', user.id),
    supabase.from('chat_rooms').select('id,item_id,created_at').eq('seller_id', user.id),
  ]);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">マイページ</h1>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">自分の出品</h2>
          <Link href="/sell" className="text-blue-600 underline">
            新規出品
          </Link>
        </div>
        {myItems && myItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myItems.map((item) => (
              <Link key={item.id} href={`/items/${item.id}`} className="border rounded p-3 hover:shadow">
                <p className="text-xs text-gray-500">{item.category}</p>
                <p className="font-semibold">{item.title}</p>
                <p className="text-blue-600">¥{item.price.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">出品がありません。</p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">購入申請 / チャット</h2>
        <div className="space-y-2">
          {[...(chatsAsBuyer ?? []), ...(chatsAsSeller ?? [])].length === 0 && (
            <p className="text-gray-600">チャット履歴がありません。</p>
          )}
          {[...(chatsAsBuyer ?? []), ...(chatsAsSeller ?? [])].map((room) => (
            <Link
              key={room.id}
              href={`/chat/${room.id}`}
              className="block border rounded p-3 hover:shadow"
            >
              <p className="text-sm">Room ID: {room.id}</p>
              <p className="text-xs text-gray-500">Item: {room.item_id}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
