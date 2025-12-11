import Link from 'next/link';
import { requireServerUser } from '@/app/lib/auth/require-auth';
import { createServerClientInstance } from '@/app/lib/supabase/server-client';

type Item = {
  id: string;
  title: string;
  price: number;
  status: string;
  image_url: string | null;
};

type ChatRoom = {
  id: string;
  item: {
    id: string;
    title: string;
    image_url: string | null;
  } | null;
};

export const dynamic = 'force-dynamic';

export default async function MyPage() {
  const user = await requireServerUser();
  const supabase = createServerClientInstance();

  const { data: items, error: itemsError } = await supabase
    .from('items')
    .select('id, title, price, status, image_url')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  if (itemsError) {
    console.error('mypage: failed to fetch items', itemsError);
  }

  const { data: rooms, error: roomsError } = await supabase
    .from('chat_rooms')
    .select('id, item:items(id, title, image_url)')
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  if (roomsError) {
    console.error('mypage: failed to fetch chat rooms', roomsError);
  }

  const myItems: Item[] = items ?? [];
  const myRooms: ChatRoom[] = rooms ?? [];

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        <header className="space-y-1">
          <h1 className="text-2xl text-primary font-semibold">マイページ</h1>
          <p className="text-sm text-secondary">自分の出品と取引中のチャットを確認できます。</p>
        </header>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl text-foreground font-semibold">自分の出品</h2>
              <p className="text-sm text-secondary">owner_id が自分のアイテム一覧</p>
            </div>
            <Link
              href="/sell"
              className="text-sm text-primary border border-primary px-3 py-1.5 rounded hover:bg-primary hover:text-white transition-colors"
            >
              新しく出品する
            </Link>
          </div>

          {myItems.length === 0 ? (
            <div className="border border-dashed border-border bg-card rounded-lg p-6 text-center text-secondary">
              まだ出品がありません。
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/items/${item.id}`}
                  className="border border-border rounded-lg bg-card overflow-hidden hover:border-primary transition-colors"
                >
                  <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-secondary text-xs">No image</span>
                    )}
                  </div>
                  <div className="p-3 space-y-1">
                    <div className="flex items-center justify-between text-xs text-secondary">
                      <span>ステータス: {item.status}</span>
                      <span className="font-semibold text-primary">
                        {new Intl.NumberFormat('ja-JP').format(item.price)}円
                      </span>
                    </div>
                    <p className="text-sm text-foreground font-medium">{item.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-xl text-foreground font-semibold">購入申請 / 取引チャット</h2>
            <p className="text-sm text-secondary">buyer/seller として関わるチャットルーム</p>
          </div>

          {myRooms.length === 0 ? (
            <div className="border border-dashed border-border bg-card rounded-lg p-6 text-center text-secondary">
              チャットルームがありません。
            </div>
          ) : (
            <div className="space-y-3">
              {myRooms.map((room) => {
                const item = room.item;
                return (
                  <Link
                    key={room.id}
                    href={`/chat/${room.id}`}
                    className="flex items-center gap-3 border border-border rounded-lg bg-card p-3 hover:border-primary transition-colors"
                  >
                    <div className="w-16 h-16 rounded bg-muted border border-border overflow-hidden flex items-center justify-center">
                      {item?.image_url ? (
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-secondary text-xs">No image</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground font-semibold">
                        {item?.title ?? '取引中の商品'}
                      </p>
                      <p className="text-xs text-secondary">ルームID: {room.id}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
