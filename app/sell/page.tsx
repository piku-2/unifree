import { createItem } from '@/app/actions/items/create-item';

const categories = ['家電', '家具', '本', '生活雑貨', 'その他'];

export default function SellPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-2xl text-primary mb-2">出品する</h1>
          <p className="text-sm text-secondary">
            タイトル、説明、価格、画像を入力して出品します。価格は100円以上で設定してください。
          </p>
        </div>

        <form action={createItem} className="space-y-5 border border-border bg-card p-6 rounded-lg" encType="multipart/form-data">
          <div className="space-y-2">
            <label className="block text-sm text-foreground">タイトル</label>
            <input
              name="title"
              type="text"
              required
              className="w-full p-3 border border-border rounded bg-card"
              placeholder="商品名を入力"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-foreground">説明</label>
            <textarea
              name="description"
              required
              rows={5}
              className="w-full p-3 border border-border rounded bg-card"
              placeholder="商品の状態や受け渡し方法を記載してください"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-foreground">価格（円）</label>
            <input
              name="price"
              type="number"
              min={100}
              required
              className="w-full p-3 border border-border rounded bg-card"
              placeholder="100"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-foreground">カテゴリ</label>
            <select name="category" required className="w-full p-3 border border-border rounded bg-card">
              <option value="">選択してください</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-foreground">画像（1枚）</label>
            <input name="image" type="file" accept="image/*" required className="w-full text-sm" />
            <p className="text-xs text-secondary">1枚のみアップロードできます。代表画像として保存されます。</p>
          </div>

          <button
            type="submit"
            className="w-full py-3 border border-primary bg-primary text-white rounded hover:bg-[#5A8BFF] transition-colors"
          >
            出品する
          </button>
        </form>
      </main>
    </div>
  );
}
