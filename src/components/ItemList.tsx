import { useState } from 'react';
import { Header } from './Header';
import { NavigateHandler } from '@/config/navigation';

type ItemListProps = {
  onNavigate: NavigateHandler;
  onSelectItem: (itemId: string) => void;
};

const allItems = [
  { id: '1', title: 'ノートパソコン ThinkPad', price: 25000, category: '家電', isLarge: false },
  { id: '2', title: '経済学の教科書セット', price: 3000, category: '本', isLarge: false },
  { id: '3', title: '一人暮らし用冷蔵庫', price: 8000, category: '家電', isLarge: true },
  { id: '4', title: 'IKEA デスク', price: 5000, category: '大型家具', isLarge: true },
  { id: '5', title: 'コーヒーメーカー', price: 2000, category: '生活雑貨', isLarge: false },
  { id: '6', title: '電子レンジ', price: 4000, category: '家電', isLarge: false },
  { id: '7', title: 'Python入門書3冊セット', price: 2500, category: '本', isLarge: false },
  { id: '8', title: '洗濯機 5kg', price: 12000, category: '家電', isLarge: true },
  { id: '9', title: 'ソファ 2人掛け', price: 15000, category: '大型家具', isLarge: true },
];

const categories = ['すべて', '家電', '本', '生活雑貨', '大型家具', 'その他'];

export function ItemList({ onNavigate, onSelectItem }: ItemListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('すべて');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [showLargeOnly, setShowLargeOnly] = useState(false);

  const handleItemClick = (itemId: string) => {
    onSelectItem(itemId);
    onNavigate('item-detail');
  };

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'すべて' || item.category === selectedCategory;
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
    const matchesLarge = !showLargeOnly || item.isLarge;
    return matchesSearch && matchesCategory && matchesPrice && matchesLarge;
  });

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-background">
      <Header title="出品一覧" onNavigate={onNavigate} showBack />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="キーワードで検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pr-12 border border-border bg-card rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 border-2 border-primary rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="space-y-6">
            <div className="border border-border bg-card p-4 rounded-lg">
              <h3 className="mb-4 text-primary">フィルター</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-sm mb-3 text-foreground">カテゴリ</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left p-2 border rounded transition-colors ${
                        selectedCategory === category 
                          ? 'bg-primary text-white border-primary' 
                          : 'bg-card border-border hover:border-primary'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm mb-3 text-foreground">価格帯</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-sm text-secondary">
                    <span>¥0</span>
                    <span>¥{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Large Items Only */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLargeOnly}
                    onChange={(e) => setShowLargeOnly(e.target.checked)}
                    className="w-5 h-5 border-2 border-border accent-primary"
                  />
                  <span className="text-sm text-foreground">大型家具のみ表示</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Items Grid */}
          <div className="md:col-span-3">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-secondary">{filteredItems.length}件の出品</p>
              <select className="p-2 border border-border rounded text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary">
                <option>新着順</option>
                <option>価格が安い順</option>
                <option>価格が高い順</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className="border border-border bg-card hover:shadow-md transition-all text-left rounded-lg overflow-hidden"
                >
                  <div className="w-full h-48 border-b border-border bg-muted flex items-center justify-center">
                    <div className="w-20 h-20 border-2 border-primary/30 rounded"></div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 border border-border rounded bg-muted text-secondary">{item.category}</span>
                      {item.isLarge && (
                        <span className="text-xs px-2 py-1 border border-primary bg-primary/10 rounded text-primary">大型</span>
                      )}
                    </div>
                    <h4 className="mb-2 text-foreground">{item.title}</h4>
                    <p className="text-xl text-accent">¥{item.price.toLocaleString()}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
