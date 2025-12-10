import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { useItem } from '../hooks/useItem';
import { ItemCarousel } from './ItemCarousel';
import { SellerInfo } from './SellerInfo';
import { PurchaseButton } from './PurchaseButton';
import { useAuth } from '@/features/user/hooks/useAuth';
import { createChatRoom } from '@/features/chat/api/createChatRoom';
import { toggleLike, getLikeStatus } from '../api/toggleLike';
import { NavigateHandler } from '@/config/navigation';

type ItemDetailProps = {
  itemId: string;
  onNavigate: NavigateHandler;
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

    if (user.id === item.user_id) {
      alert('自分の出品商品です');
      return;
    }

    setIsProcessing(true);
    try {
      const roomId = await createChatRoom(item.id, user.id, item.user_id);
      onNavigate('chat-room', { roomId });
    } catch (e) {
      console.error(e);
      alert('チャットの開始に失敗しました');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (user && item) {
      getLikeStatus(item.id, user.id).then(setIsFavorite);
    }
  }, [user, item]);

  const handleLike = async () => {
    if (!user) {
      alert('ログインが必要です');
      return;
    }
    if (!item) return;

    const newStatus = await toggleLike(item.id, user.id);
    setIsFavorite(newStatus);
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
          <div>
            <ItemCarousel images={item.images} />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-1 border border-border rounded bg-muted text-secondary">{item.category}</span>
                {item.condition && (
                  <span className="text-xs px-2 py-1 border border-info bg-info/20 rounded text-primary">{item.condition}</span>
                )}
              </div>
              <h2 className="text-2xl mb-4 text-primary">{item.title}</h2>
              <p className="text-3xl mb-6 text-accent">\{item.price.toLocaleString()}</p>
            </div>

            <div className="border border-border p-4 bg-card rounded-lg">
              <h3 className="text-sm mb-2 text-primary">説明</h3>
              <p className="text-sm text-foreground whitespace-pre-wrap">{item.description}</p>
            </div>

            <SellerInfo seller={item.user} />

            <div className="flex gap-3">
              <button
                onClick={handleLike}
                className={`px-6 py-3 border-2 rounded transition-colors ${
                  isFavorite ? 'border-destructive bg-destructive/10 text-destructive' : 'border-border bg-card text-secondary hover:border-destructive'
                }`}
              >
                {isFavorite ? '★' : '☆'} 気になる
              </button>
              <PurchaseButton onClick={handleStartChat} disabled={isProcessing} />
            </div>
          </div>
        </div>

        <section className="mt-12">
          <h3 className="mb-4 text-primary">同じカテゴリの出品</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
