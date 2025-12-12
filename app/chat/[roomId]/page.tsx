import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { supabaseServerClient } from '../../../lib/supabase/server';
import { sendMessage } from '../../actions/chat';

export default async function ChatRoomPage({ params }: { params: { roomId: string } }) {
  const supabase = supabaseServerClient();
  const roomId = Number(params.roomId);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: room, error: roomError } = await supabase
    .from('chat_rooms')
    .select('id,buyer_id,seller_id')
    .eq('id', roomId)
    .single();
  if (roomError || !room) {
    redirect('/');
  }
  if (room.buyer_id !== user.id && room.seller_id !== user.id) {
    redirect('/');
  }

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });

  async function handleSend(formData: FormData) {
    'use server';
    const content = String(formData.get('content') ?? '').trim();
    if (!content) return;
    await sendMessage(roomId, content);
    revalidatePath(`/chat/${roomId}`);
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">チャット</h1>
      <div className="space-y-2 border rounded p-3 max-w-2xl">
        {messages && messages.length > 0 ? (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className="border rounded px-3 py-2 max-w-[70%]">
                <p>{m.content}</p>
                <p className="text-xs text-gray-500">{m.created_at}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">メッセージはまだありません。</p>
        )}
      </div>

      <form action={handleSend} className="flex gap-2 max-w-2xl">
        <input name="content" className="flex-1 border rounded p-2" placeholder="メッセージを入力" />
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">
          送信
        </button>
      </form>
    </main>
  );
}
