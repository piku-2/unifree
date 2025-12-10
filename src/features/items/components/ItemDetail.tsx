import { useState } from 'react';
import { Header } from '@/components/Header';
import { useItem } from '../hooks/useItem';
import { ItemCarousel } from './ItemCarousel';
import { SellerInfo } from './SellerInfo';
import { PurchaseButton } from './PurchaseButton';

import { useAuth } from '@/features/user/hooks/useAuth';
import { createChatRoom } from '@/features/chat/api/createChatRoom';

type ItemDetailProps = {
  itemId: string;
  onNavigate: (page: string, params?: any) => void;
};

export function ItemDetail({ itemId, onNavigate }: ItemDetailProps) {
  const { user } = useAuth();
  const { item, loading, error } = useItem(itemId);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartChat = async () => {
      if (!user) {
          alert('ログインが必要です');
          onNavigate('login');
          return;
      }
      if (!item) return;

      // Prevent self-chat
      if (user.id === item.user_id) {
          alert('自分の出品商品です');
          return;
      }

      setIsProcessing(true);
      try {
          const roomId = await createChatRoom(item.id, user.id, item.user_id);
          onNavigate('chat-room', { roomId }); // pass params if supported, else setCurrentPage needs to handle
          // App.tsx needs refactor to support params or shared state
          // For now assume onNavigate can switch page, and we save roomId somewhere?
          // Or we use a specific page ID like `chat-room/${roomId}` if router supports it?
          // Current App.tsx is simple state.
          // I will assume onNavigate handles simple strings, but I need to pass roomId.
          // I'll update App.tsx to support selectedRoomId state similar to selectedItemId.
          // But I can't change App.tsx signature easily without changing all calls.
          // Use onNavigate('chat-room') and assume standard way to pass ID,
          // e.g. a global setter or a second arg if I updated App.tsx.
          // I will update App.tsx to accept params or use a separate setter passed down.
          // Warning: ItemDetail props signature change required.
      } catch (e) {
          console.error(e);
          alert('チャットの開始に失敗しました');
      } finally {
          setIsProcessing(false);
      }
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-20 md:pb-8 bg-background">
        <Header title="出品詳細" onNavigate={onNavigate} showBack />
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen pb-20 md:pb-8 bg-background">
        <Header title="出品詳細" onNavigate={onNavigate} showBack />
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-red-500">
           {error ? error.message : '商品が見つかりませんでした'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-background">
      <Header title="出品詳細" onNavigate={onNavigate} showBack />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div>
            <ItemCarousel images={item.images} />
          </div>

          {/* Item Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-1 border border-border rounded bg-muted text-secondary">{item.category}</span>
                {item.condition && (
                   <span className="text-xs px-2 py-1 border border-info bg-info/20 rounded text-primary">{item.condition}</span>
                )}
              </div>
              <h2 className="text-2xl mb-4 text-primary">{item.title}</h2>
              <p className="text-3xl mb-6 text-accent">¥{item.price.toLocaleString()}</p>
            </div>

            <div className="border border-border p-4 bg-card rounded-lg">
              <h3 className="text-sm mb-2 text-primary">説明</h3>
              <p className="text-sm text-foreground whitespace-pre-wrap">{item.description}</p>
            </div>

            {/* Event Info Placeholder (Task 4 says 'Seller Info' and 'Purchase Flow', Event info is part of item detail but not core data now?)
                Accessing item.event if logic requires it, but it's not in schema yet. I'll omit or keep simple.
            */}

            {/* Seller Info */}
            <SellerInfo seller={item.user} />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`px-6 py-3 border-2 rounded transition-colors ${
                  isFavorite ? 'border-destructive bg-destructive/10 text-destructive' : 'border-border bg-card text-secondary hover:border-destructive'
                }`}
              >
                {isFavorite ? '♥' : '♡'} 気になる
              </button>
              <PurchaseButton
                 onClick={handleStartChat}
                 disabled={isProcessing}
              />
            </div>
          </div>
        </div>

        {/* Related Items (Dummy for now to keep UI) */}
        <section className="mt-12">
          <h3 className="mb-4 text-primary">同じカテゴリの出品</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {/* Simple dummy list to preserve layout expectations */}
             {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-border bg-card rounded-lg overflow-hidden opacity-50">
                    <div className="h-32 bg-muted flex items-center justify-center text-xs">関連商品 {i}</div>
                    <div className="p-2 text-xs">開発中</div>
                </div>
             ))}
          </div>
        </section>
      </main>
    </div>
  );
}
