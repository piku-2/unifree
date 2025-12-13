'use client';

import { useMemo, useState } from 'react';
import { Header } from './Header';
import { NavigateHandler } from '@/config/navigation';
import { useItems } from '@/features/items/hooks/useItems';

type HomeProps = {
  onNavigate: NavigateHandler;
};

export function Home({ onNavigate }: HomeProps) {
  const { items, loading, error } = useItems();
  const [selectedCategory, setSelectedCategory] = useState('すべて');

  const categories = useMemo(() => {
    const unique = Array.from(new Set(items.map((item) => item.category).filter(Boolean)));
    return ['すべて', ...unique];
  }, [items]);

  const filteredItems = useMemo(() => {
    const byCategory =
      selectedCategory === 'すべて'
        ? items
        : items.filter((item) => item.category === selectedCategory);
    return byCategory;
  }, [items, selectedCategory]);

  const visibleItems = filteredItems.slice(0, 6);

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-background">
      <Header title="ユニフリ" onNavigate={onNavigate} />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        <section>
          <h3 className="mb-4 text-primary">人気カテゴリ</h3>
          {categories.length > 1 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`border border-border p-6 bg-card hover:bg-muted hover:border-primary flex flex-col items-center gap-2 rounded-lg transition-all ${
                    selectedCategory === category ? 'border-primary' : ''
                  }`}
                >
                  <div className="w-16 h-16 border-2 border-primary rounded-full flex items-center justify-center text-sm bg-info/20">
                    {category === 'すべて' ? 'ALL' : category}
                  </div>
                  <span className="text-foreground">{category}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-secondary">まだカテゴリーがありません。</p>
          )}
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-primary">新着出品</h3>
            <button
              onClick={() => setSelectedCategory('すべて')}
              className="text-sm text-primary hover:text-[#5A8BFF] underline"
            >
              すべて見る →
            </button>
          </div>

          {error && (
            <p className="text-destructive text-sm mb-4">出品の取得中にエラーが発生しました。</p>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : visibleItems.length === 0 ? (
            <div className="text-center py-20 text-secondary">出品がまだありません。</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {visibleItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    onNavigate('item-detail', { itemId: typeof item.id === 'string' ? item.id : String(item.id) })
                  }
                  className="border border-border bg-card hover:shadow-md transition-shadow text-left rounded-lg overflow-hidden"
                >
                  <div className="w-full h-48 border-b border-border bg-muted flex items-center justify-center">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-20 h-20 border-2 border-primary/30 rounded" />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs mb-1 text-secondary">{item.category}</p>
                    <h4 className="mb-2 text-foreground line-clamp-2">{item.title}</h4>
                    <p className="text-xl text-accent">\{item.price.toLocaleString()}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="border border-border p-6 bg-card text-center rounded-lg shadow-sm">
          <h3 className="mb-2 text-primary">出品してみませんか？</h3>
          <p className="text-sm mb-4 text-secondary">不要なものを学内フリマで販売しましょう</p>
          <button
            onClick={() => onNavigate('sell')}
            className="px-8 py-3 border-2 border-accent bg-accent text-white rounded hover:bg-[#FF7F50] transition-colors"
          >
            出品する
          </button>
        </section>
      </main>
    </div>
  );
}
