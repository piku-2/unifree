import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { startChat } from '../../actions/chat';
import { getItem } from '../../actions/items';
import { supabaseServerClient } from '../../../lib/supabase/server';

export default async function ItemDetailPage({ params }: { params: { id: string } }) {
  const itemId = params.id;
  const item = await getItem(itemId);
  if (!item) {
    notFound();
  }
  const safeItem = item as NonNullable<typeof item>;
  const seller = safeItem.owner;
  const sellerInitial = seller?.username?.[0]?.toUpperCase() ?? '?';

  const supabase = supabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  async function handleStartChat() {
    'use server';
    const roomId = await startChat(itemId);
    revalidatePath(`/chat/${roomId}`);
    redirect(`/chat/${roomId}`);
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{safeItem.title}</h1>
      <p className="text-gray-600">{safeItem.category}</p>
      <p className="text-xl text-blue-600">\{safeItem.price.toLocaleString()}</p>
      <p>{safeItem.description}</p>
      {safeItem.image_url && <img src={safeItem.image_url} alt={safeItem.title} className="max-w-md" />}

      <section className="p-4 border rounded space-y-2">
        <h2 className="text-lg font-semibold">出品者</h2>
        <div className="flex items-center gap-3">
          {seller?.avatar_url ? (
            <img
              src={seller.avatar_url}
              alt={seller.username ?? '出品者'}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
              {sellerInitial}
            </div>
          )}
          <div>
            <p className="font-medium">{seller?.username ?? '出品者情報が取得できません'}</p>
          </div>
        </div>
      </section>

      <form action={handleStartChat} className="space-y-2">
        <button
          type="submit"
          className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-60"
          disabled={!user || user.id === safeItem.owner_id}
        >
          チャットを開始
        </button>
        {!user && <p className="text-sm text-gray-600">ログインしてチャットを開始できます。</p>}
        {user?.id === safeItem.owner_id && (
          <p className="text-sm text-gray-600">自分の出品にはチャットできません。</p>
        )}
      </form>
    </main>
  );
}
