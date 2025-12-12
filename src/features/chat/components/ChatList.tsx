import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { getChatRooms } from '../api/getChatRooms';
import { useAuth } from '@/features/user/hooks/useAuth';
import { supabase } from '@/libs/supabase/client';
import { NavigateHandler } from '@/config/navigation';

type ChatListProps = {
  onNavigate: NavigateHandler;
};

export function ChatList({ onNavigate }: ChatListProps) {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadRooms = async () => {
      const data = await getChatRooms(user.id);
      setRooms(data);
      setLoading(false);
    };

    loadRooms();

    const channel = supabase
      .channel(`chat_list:${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_rooms', filter: `buyer_id=eq.${user.id}` },
        loadRooms,
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_rooms', filter: `seller_id=eq.${user.id}` },
        loadRooms,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleRoomClick = (roomId: string) => {
    onNavigate('chat-room', { roomId });
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-background">
      <Header title="メッセージ" onNavigate={onNavigate} />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-10 text-secondary">メッセージはまだありません</div>
        ) : (
          <div className="space-y-4">
            {rooms.map((room) => {
              const partner = room.buyer_id === user?.id ? room.seller : room.buyer;
              const partnerName = partner?.name || partner?.username || 'ユーザー';
              const lastMsg = Array.isArray(room.last_message)
                ? room.last_message[0]
                : room.last_message || {};

              return (
                <button
                  key={room.id}
                  onClick={() => handleRoomClick(room.id)}
                  className="w-full border border-border bg-card hover:shadow-md transition-all text-left rounded-lg p-4 flex gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-muted overflow-hidden flex-shrink-0">
                    {partner?.avatar_url ? (
                      <img src={partner.avatar_url} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">??</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold truncate text-foreground">{partnerName}</span>
                      <span className="text-xs text-secondary">
                        {new Date(room.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-secondary truncate mb-1">
                      {room.item?.title || '商品情報なし'}
                    </p>
                    <p className="text-sm text-foreground truncate">{lastMsg?.content || '...'}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
