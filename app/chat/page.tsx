import Link from 'next/link';
import { supabaseServerClient } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ChatListPage() {
  const supabase = supabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: rooms } = await supabase
    .from('chat_rooms')
    .select('id,item_id,created_at')
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">チャット一覧</h1>
      {rooms && rooms.length > 0 ? (
        <div className="space-y-2">
          {rooms.map((room) => (
            <Link key={room.id} href={`/chat/${room.id}`} className="block border rounded p-3 hover:shadow">
              <p className="text-sm">Room ID: {room.id}</p>
              <p className="text-xs text-gray-600">Item: {room.item_id}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">チャットはまだありません。</p>
      )}
    </main>
  );
}
