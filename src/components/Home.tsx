import { Header } from './Header';
import { NavigateHandler } from '@/config/navigation';

type HomeProps = {
  onNavigate: NavigateHandler;
};

const categories = [
  { id: 1, name: '家電', icon: '📱' },
  { id: 2, name: '本', icon: '📚' },
  { id: 3, name: '生活雑貨', icon: '🏠' },
  { id: 4, name: '大型家具', icon: '🛋️' },
];

const recommendedItems = [
  { id: 1, title: 'ノートパソコン ThinkPad', price: 25000, category: '家電' },
  { id: 2, title: '経済学の教科書セット', price: 3000, category: '本' },
  { id: 3, title: '一人暮らし用冷蔵庫', price: 8000, category: '家電' },
  { id: 4, title: 'IKEA デスク', price: 5000, category: '大型家具' },
  { id: 5, title: 'コーヒーメーカー', price: 2000, category: '生活雑貨' },
  { id: 6, title: '電子レンジ', price: 4000, category: '家電' },
];

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-background">
      <Header title="ユニフリ" onNavigate={onNavigate} />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">


        {/* Categories */}
        <section>
          <h3 className="mb-4 text-primary">人気カテゴリ</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onNavigate('item-list')}
                className="border border-border p-6 bg-card hover:bg-muted hover:border-primary flex flex-col items-center gap-2 rounded-lg transition-all"
              >
                <div className="w-16 h-16 border-2 border-primary rounded-full flex items-center justify-center text-2xl bg-info/20">
                  {category.icon}
                </div>
                <span className="text-foreground">{category.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Recommended Items */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-primary">おすすめ出品</h3>
            <button onClick={() => onNavigate('item-list')} className="text-sm text-primary hover:text-[#5A8BFF] underline">
              すべて見る →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate('item-list')}
                className="border border-border bg-card hover:shadow-md transition-shadow text-left rounded-lg overflow-hidden"
              >
                <div className="w-full h-48 border-b border-border bg-muted flex items-center justify-center">
                  <div className="w-20 h-20 border-2 border-primary/30 rounded"></div>
                </div>
                <div className="p-4">
                  <p className="text-xs mb-1 text-secondary">{item.category}</p>
                  <h4 className="mb-2 text-foreground">{item.title}</h4>
                  <p className="text-xl text-accent">¥{item.price.toLocaleString()}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* CTA for Selling */}
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
