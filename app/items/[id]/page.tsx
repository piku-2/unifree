import { redirect } from 'next/navigation';
import { startChat } from '../../actions/chat';
import { getItem } from '../../actions/items';
import { supabaseServerClient } from '../../../lib/supabase/server';
import { revalidatePath } from 'next/cache';

export default async function ItemDetailPage({ params }: { params: { id: string } }) {
  const itemId = Number(params.id);
  const item = await getItem(itemId);

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
      <h1 className="text-2xl font-bold">{item.title}</h1>
      <p className="text-gray-600">{item.category}</p>
      <p className="text-xl text-blue-600">¥{item.price.toLocaleString()}</p>
      <p>{item.description}</p>
      {item.image_url && <img src={item.image_url} alt={item.title} className="max-w-md" />}

      <form action={handleStartChat} className="space-y-2">
        <button
          type="submit"
          className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-60"
          disabled={!user || user.id === item.owner_id}
        >
          チャットを開始
        </button>
        {!user && <p className="text-sm text-gray-600">ログインしてチャットを開始できます。</p>}
        {user?.id === item.owner_id && (
          <p className="text-sm text-gray-600">自分の出品にはチャットできません。</p>
        )}
      </form>
    </main>
  );
}
