import { notFound } from 'next/navigation';
import { createServerClientInstance } from '@/app/lib/supabase/server-client';
import { requireServerUser } from '@/app/lib/auth/require-auth';
import { ChatRoomClient } from './chat-room-client';

type Message = {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
};

export const dynamic = 'force-dynamic';

export default async function ChatRoomPage({ params }: { params: { roomId: string } }) {
  const user = await requireServerUser();
  const supabase = createServerClientInstance();

  const { data: room, error: roomError } = await supabase
    .from('chat_rooms')
    .select('id, buyer_id, seller_id')
    .eq('id', params.roomId)
    .maybeSingle();

  if (roomError) {
    console.error('chat room fetch failed', roomError);
    notFound();
  }

  if (!room || (room.buyer_id !== user.id && room.seller_id !== user.id)) {
    notFound();
  }

  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('id, content, sender_id, created_at')
    .eq('room_id', room.id)
    .order('created_at', { ascending: true });

  if (messagesError) {
    console.error('messages fetch failed', messagesError);
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <div>
          <h1 className="text-2xl text-primary font-semibold">チャット</h1>
          <p className="text-sm text-secondary">購入申請のやり取りを行います。</p>
        </div>

        <ChatRoomClient roomId={room.id} userId={user.id} messages={messages || []} />
      </main>
    </div>
  );
}
