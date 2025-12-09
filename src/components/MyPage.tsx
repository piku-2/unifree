import { useState } from 'react';
import { Header } from './Header';

type MyPageProps = {
  onNavigate: (page: string) => void;
  onSelectItem: (itemId: string) => void;
};

const myItems = [
  { id: '1', title: 'ノートパソコン ThinkPad', price: 25000, category: '家電', status: '出品中', views: 45 },
  { id: '2', title: '電子レンジ', price: 4000, category: '家電', status: '出品中', views: 23 },
  { id: '3', title: 'デスクライト', price: 1500, category: '生活雑貨', status: '取引完了', views: 67 },
];

const favoriteItems = [
  { id: '4', title: 'IKEA デスク', price: 5000, category: '大型家具', seller: '山田美咲' },
  { id: '5', title: '一人暮らし用冷蔵庫', price: 8000, category: '家電', seller: '鈴木一郎' },
  { id: '6', title: '経済学の教科書セット', price: 3000, category: '本', seller: '佐藤花子' },
];

export function MyPage({ onNavigate, onSelectItem }: MyPageProps) {
  const [activeTab, setActiveTab] = useState<'items' | 'favorites'>('items');

  const handleItemClick = (itemId: string) => {
    onSelectItem(itemId);
    onNavigate('item-detail');
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-background">
      <Header title="マイページ" onNavigate={onNavigate} />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* User Profile */}
        <section className="border border-border bg-card p-6 mb-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 border-2 border-border rounded-full bg-muted"></div>
            <div>
              <h2 className="text-xl mb-1 text-primary">田中太郎</h2>
              <p className="text-sm text-secondary">工学部3年</p>
              <div className="flex items-center gap-3 mt-2 text-sm text-secondary">
                <span>⭐ 4.8</span>
                <span>出品数：{myItems.length}件</span>
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

        {/* Tabs */}
        <div className="border-b-2 border-border mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('items')}
              className={`flex-1 py-3 border-2 border-b-0 rounded-t transition-colors ${
                activeTab === 'items' ? 'bg-card border-border text-primary -mb-[2px] border-b-2 border-b-card' : 'bg-muted border-border text-secondary hover:text-primary'
              }`}
            >
              自分の出品（{myItems.length}）
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 py-3 border-2 border-b-0 border-l-0 rounded-t transition-colors ${
                activeTab === 'favorites' ? 'bg-card border-border text-primary -mb-[2px] border-b-2 border-b-card' : 'bg-muted border-border text-secondary hover:text-primary'
              }`}
            >
              気になるリスト（{favoriteItems.length}）
            </button>
          </div>
        </div>

        {/* My Items */}
        {activeTab === 'items' && (
          <div className="space-y-4">
            {myItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="w-full border border-border bg-card hover:shadow-md transition-all text-left rounded-lg"
              >
                <div className="flex gap-4 p-4">
                  <div className="w-24 h-24 border border-border bg-muted flex-shrink-0 rounded flex items-center justify-center">
                    <div className="w-12 h-12 border-2 border-primary/30 rounded"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 border border-border rounded bg-muted text-secondary">{item.category}</span>
                      <span className={`text-xs px-2 py-1 border rounded ${
                        item.status === '出品中' ? 'bg-info/20 border-info text-primary' : 'bg-muted border-border text-secondary'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <h4 className="mb-2 text-foreground">{item.title}</h4>
                    <p className="text-xl mb-2 text-accent">¥{item.price.toLocaleString()}</p>
                    <p className="text-xs text-secondary">👁️ {item.views}回閲覧</p>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <button className="w-8 h-8 border border-border rounded text-xs hover:bg-muted transition-colors">⋮</button>
                    <span className="text-xs text-primary">編集 →</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Favorite Items */}
        {activeTab === 'favorites' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoriteItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="border border-border bg-card hover:shadow-md transition-all text-left rounded-lg overflow-hidden"
              >
                <div className="w-full h-48 border-b border-border bg-muted flex items-center justify-center">
                  <div className="w-20 h-20 border-2 border-primary/30 rounded"></div>
                </div>
                <div className="p-4">
                  <p className="text-xs mb-1 text-secondary">{item.category}</p>
                  <h4 className="mb-2 text-foreground">{item.title}</h4>
                  <p className="text-xl mb-2 text-accent">¥{item.price.toLocaleString()}</p>
                  <div className="flex items-center gap-2 text-xs text-secondary">
                    <div className="w-5 h-5 border border-border rounded-full bg-muted"></div>
                    <span>{item.seller}</span>
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
