import { useState } from 'react';
import { Header } from '@/components/Header';
import { useItems } from '../hooks/useItems';
import { ItemCard } from './ItemCard';
import { SearchBar } from './SearchBar';

type ItemListProps = {
  onNavigate: (page: string) => void;
  onSelectItem: (itemId: string) => void;
};

const categories = ['すべて', '家電', '本', '生活雑貨', '大型家具', 'その他'];

export function ItemList({ onNavigate, onSelectItem }: ItemListProps) {
  const { items, loading, error } = useItems();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('すべて');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  // showLargeOnly removed as it's not in DB schema yet, or logic needs adjustment.
  // Should I keeping it? Original had it.
  // I will check if 'isLarge' can be inferred or just comment it out to avoid TS errors.
  // Task says "Sort (New/Popular dummy)". Original has sort select.
  // I will implement client-side sort.

  // Sorting state
  const [sortOrder, setSortOrder] = useState('新着順');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'すべて' || item.category === selectedCategory;
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    if (sortOrder === '価格が安い順') return a.price - b.price;
    if (sortOrder === '価格が高い順') return b.price - a.price;
    // Default: Newest ('新着順') -> CreatedAt desc.
    // Assuming DB getItems already sorted by desc created_at.
    // If we want strict client sort:
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (error) {
    return <div className="p-8 text-center text-red-500">エラーが発生しました: {error.message}</div>;
  }

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-background">
      <Header title="出品一覧" onNavigate={onNavigate} showBack />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
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
            </div>
          </aside>

          {/* Items Grid */}
          <div className="md:col-span-3">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-secondary">{filteredItems.length}件の出品</p>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="p-2 border border-border rounded text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>新着順</option>
                <option>価格が安い順</option>
                <option>価格が高い順</option>
              </select>
            </div>

            {loading ? (
               <div className="flex justify-center items-center h-64">
                   <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
               </div>
            ) : filteredItems.length === 0 ? (
               <div className="text-center py-20 text-secondary">
                   条件に一致する商品は見つかりませんでした。
               </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                    <ItemCard key={item.id} item={item} onClick={() => {
                        onSelectItem(item.id);
                        onNavigate('item-detail');
                    }} />
                ))}
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
