import { useState } from 'react';
import { Header } from './Header';

type SellFormProps = {
  onNavigate: (page: string) => void;
};

const events = [
  { id: '1', name: '春学期フリマ 2025 (4/15)' },
  { id: '2', name: '卒業生応援フリマ (3/25)' },
];

const categories = ['家電', '家具', '本', '生活雑貨', 'その他'];
const conditions = ['新品', '美品', '使用感あり'];

export function SellForm({ onNavigate }: SellFormProps) {
  const [formData, setFormData] = useState({
    event: '',
    title: '',
    category: '',
    price: '',
    condition: '',
    description: '',
    deliveryMethod: '手渡し',
  });

  const [uploadedImages, setUploadedImages] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('出品を登録しました！');
    onNavigate('mypage');
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-background">
      <Header title="出品する" onNavigate={onNavigate} showBack />
      
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="border border-border bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-xl mb-6 text-primary">新規出品</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Selection */}
            <div>
              <label className="block text-sm mb-2 text-foreground">
                イベント選択 <span className="text-destructive">*</span>
              </label>
              <select
                required
                value={formData.event}
                onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                className="w-full p-3 border border-border rounded bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">イベントを選択してください</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm mb-2 text-foreground">
                商品画像（1〜3枚） <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setUploadedImages(i)}
                    className={`aspect-square border-2 rounded-lg flex items-center justify-center transition-all ${
                      i <= uploadedImages ? 'border-primary bg-info/10' : 'border-border bg-muted hover:border-primary'
                    }`}
                  >
                    {i <= uploadedImages ? (
                      <div className="w-16 h-16 border-2 border-primary/30 rounded"></div>
                    ) : (
                      <span className="text-4xl text-secondary">+</span>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-secondary mt-2">1枚目が代表画像になります</p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm mb-2 text-foreground">
                タイトル <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="例：ノートパソコン ThinkPad"
                className="w-full p-3 border border-border rounded bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm mb-2 text-foreground">
                カテゴリ <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setFormData({ ...formData, category })}
                    className={`p-3 border-2 rounded transition-colors ${
                      formData.category === category ? 'bg-primary text-white border-primary' : 'bg-card border-border hover:border-primary'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm mb-2 text-foreground">
                価格 <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground">¥</span>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0"
                  className="w-full p-3 pl-8 border border-border rounded bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm mb-2 text-foreground">
                状態 <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {conditions.map((condition) => (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => setFormData({ ...formData, condition })}
                    className={`p-3 border-2 rounded transition-colors ${
                      formData.condition === condition ? 'bg-primary text-white border-primary' : 'bg-card border-border hover:border-primary'
                    }`}
                  >
                    {condition}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm mb-2 text-foreground">
                説明 <span className="text-destructive">*</span>
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="商品の詳細、使用期間、状態などを記入してください"
                rows={6}
                className="w-full p-3 border border-border rounded resize-none bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-secondary mt-2">最低50文字以上</p>
            </div>

            {/* Delivery Method */}
            <div>
              <label className="block text-sm mb-2 text-foreground">
                引き渡し方法 <span className="text-destructive">*</span>
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 p-3 border-2 border-border rounded cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="radio"
                    name="delivery"
                    value="手渡し"
                    checked={formData.deliveryMethod === '手渡し'}
                    onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value })}
                    className="w-5 h-5 accent-primary"
                  />
                  <div>
                    <p className="text-foreground">会場で手渡し</p>
                    <p className="text-xs text-secondary">イベント当日に直接受け渡し</p>
                  </div>
                </label>
                <label className="flex items-center gap-2 p-3 border-2 border-border rounded cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="radio"
                    name="delivery"
                    value="大型配送"
                    checked={formData.deliveryMethod === '大型配送'}
                    onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value })}
                    className="w-5 h-5 accent-primary"
                  />
                  <div>
                    <p className="text-foreground">大型配送案内あり</p>
                    <p className="text-xs text-secondary">大型家具など配送が必要な場合</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => onNavigate('mypage')}
                className="px-6 py-3 border-2 border-border bg-card rounded hover:bg-muted transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="flex-1 py-3 border-2 border-accent bg-accent text-white rounded hover:bg-[#FF7F50] transition-colors"
              >
                出品する
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
