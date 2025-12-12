import { useState, useEffect } from 'react';
import { Header } from './Header';
import { useAuth } from '@/features/user/hooks/useAuth';
import { useMyItems } from '@/features/items/hooks/useMyItems';
import { MyItemList } from '@/features/user/components/MyItemList';
import { NavigateHandler } from '@/config/navigation';

type MyPageProps = {
  onNavigate: NavigateHandler;
};

export function MyPage({ onNavigate }: MyPageProps) {
  const { user } = useAuth();
  const { items, loading, handleDelete } = useMyItems();
  const [activeTab, setActiveTab] = useState<'items' | 'favorites'>('items');
  const [likedItems, setLikedItems] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === 'favorites' && user) {
      import('@/features/items/api/getLikedItems').then(({ getLikedItems }) => {
        getLikedItems(user.id).then(setLikedItems);
      });
    }
  }, [activeTab, user]);

  const handleItemClick = (itemId: string) => {
    onNavigate('item-detail', { itemId });
  };

  const handleEdit = (itemId: string) => {
    onNavigate('item-edit', { itemId });
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-background">
      <Header title="マイページ" onNavigate={onNavigate} />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <section className="border border-border bg-card p-6 mb-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative group">
              <div className="w-20 h-20 border-2 border-border rounded-full bg-muted overflow-hidden flex items-center justify-center">
                {user?.user_metadata?.avatar_url ? (
                   <img src={user?.user_metadata?.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                   <span className="text-2xl">👤</span>
                )}
              </div>
              <button
                onClick={() => onNavigate('profile_edit')}
                className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full shadow-md hover:bg-[#5A8BFF] transition-colors"
                title="プロフィールを編集"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
              </button>
            </div>

            <div>
              <h2 className="text-xl mb-1 text-primary">{user?.user_metadata?.name || 'ゲスト'}</h2>
              <p className="text-sm text-secondary">{user?.user_metadata?.department || '学部未設定'}</p>
              <div className="flex items-center gap-3 mt-2 text-sm text-secondary">
                <span>? 4.8</span>
                <span>出品数：{items.length}件</span>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => onNavigate('profile_edit')}
                  className="px-4 py-2 border-2 border-border rounded hover:bg-muted transition-colors text-sm"
                >
                  プロフィール編集
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('sell')}
            className="w-full py-3 border-2 border-accent bg-accent text-white rounded hover:bg-[#FF7F50] transition-colors"
          >
            新しく出品する
          </button>
        </section>

        <div className="border-b-2 border-border mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('items')}
              className={`flex-1 py-3 border-2 border-b-0 rounded-t transition-colors ${
                activeTab === 'items'
                  ? 'bg-card border-border text-primary -mb-[2px] border-b-2 border-b-card'
                  : 'bg-muted border-border text-secondary hover:text-primary'
              }`}
            >
              自分の出品（{items.length}）
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 py-3 border-2 border-b-0 border-l-0 rounded-t transition-colors ${
                activeTab === 'favorites'
                  ? 'bg-card border-border text-primary -mb-[2px] border-b-2 border-b-card'
                  : 'bg-muted border-border text-secondary hover:text-primary'
              }`}
            >
              気になるリスト（{likedItems.length}）
            </button>
          </div>
        </div>

        {activeTab === 'items' && (
          <MyItemList
            items={items}
            loading={loading}
            onItemClick={handleItemClick}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}

        {activeTab === 'favorites' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {likedItems.length === 0 && (
              <div className="p-4 text-gray-500">お気に入りはありません</div>
            )}
            {likedItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="border border-border bg-card hover:shadow-md transition-all text-left rounded-lg overflow-hidden flex flex-row h-32"
              >
                <div className="w-32 h-full border-r border-border bg-muted flex items-center justify-center flex-shrink-0">
                  {item.images && item.images[0] ? (
                    <img src={item.images[0]} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 border-2 border-primary/30 rounded"></div>
                  )}
                </div>
                <div className="p-4 flex-1">
                  <p className="text-xs mb-1 text-secondary">{item.category}</p>
                  <h4 className="mb-2 text-foreground line-clamp-1">{item.title}</h4>
                  <p className="text-xl mb-2 text-accent">\{item.price?.toLocaleString()}</p>
                  <div className="flex items-center gap-2 text-xs text-secondary">
                    <span>{item.user?.name}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}
