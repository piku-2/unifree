import { useState } from "react";
import Header from "./Header";

type ItemDetailProps = {
  itemId: string;
  onNavigate: (page: string) => void;
};

const itemDetails = {
  "1": {
    title: "ノートパソコン ThinkPad X1 Carbon",
    price: 25000,
    description:
      "2年前に購入したThinkPadです。卒業に伴い出品します。動作確認済み、目立つ傷はありません。充電器も付属します。プログラミングの授業で使用していました。",
    category: "家電",
    condition: "美品",
    event: "春学期フリマ 2025",
    seller: {
      name: "田中太郎",
      department: "工学部3年",
      rating: 4.8,
      itemCount: 12,
    },
    images: 3,
    specs: [
      "CPU: Intel Core i5",
      "メモリ: 8GB",
      "ストレージ: SSD 256GB",
      "購入時期: 2023年4月",
    ],
    deliveryMethod: "手渡し",
    isLarge: false,
  },
};

export function ItemDetail({ itemId, onNavigate }: ItemDetailProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const item =
    itemDetails[itemId as keyof typeof itemDetails] || itemDetails["1"];

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-background">
      <Header title="出品詳細" onNavigate={onNavigate} showBack />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div>
            <div className="border border-border bg-muted mb-4 rounded-lg overflow-hidden">
              <div className="aspect-square flex items-center justify-center">
                <div className="w-32 h-32 border-2 border-primary/30 rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <button
                  key={i}
                  className="border border-border bg-muted aspect-square flex items-center justify-center hover:border-primary transition-colors rounded"
                >
                  <div className="w-12 h-12 border-2 border-primary/30 rounded"></div>
                </button>
              ))}
            </div>
          </div>

          {/* Item Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-1 border border-border rounded bg-muted text-secondary">
                  {item.category}
                </span>
                <span className="text-xs px-2 py-1 border border-info bg-info/20 rounded text-primary">
                  {item.condition}
                </span>
              </div>
              <h2 className="text-2xl mb-4 text-primary">{item.title}</h2>
              <p className="text-3xl mb-6 text-accent">
                ¥{item.price.toLocaleString()}
              </p>
            </div>

            <div className="border border-border p-4 bg-card rounded-lg">
              <h3 className="text-sm mb-2 text-primary">説明</h3>
              <p className="text-sm text-foreground">{item.description}</p>
            </div>

            <div className="border border-border p-4 bg-card rounded-lg">
              <h3 className="text-sm mb-3 text-primary">商品情報</h3>
              <div className="space-y-2 text-sm text-secondary">
                {item.specs.map((spec, index) => (
                  <div key={index} className="flex">
                    <span>・{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-border p-4 bg-card rounded-lg">
              <h3 className="text-sm mb-2 text-primary">イベント情報</h3>
              <p className="text-sm text-foreground">📅 {item.event}</p>
              <p className="text-sm mt-2 text-foreground">
                🚚 受け渡し方法：{item.deliveryMethod}
              </p>
            </div>

            {/* Seller Info */}
            <div className="border border-border p-4 bg-card rounded-lg">
              <h3 className="text-sm mb-3 text-primary">出品者</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 border-2 border-border rounded-full bg-muted"></div>
                <div>
                  <p className="text-foreground">{item.seller.name}</p>
                  <p className="text-xs text-secondary">
                    {item.seller.department}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-secondary">
                <span>⭐ {item.seller.rating}</span>
                <span>出品数：{item.seller.itemCount}件</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`px-6 py-3 border-2 rounded transition-colors ${
                  isFavorite
                    ? "border-destructive bg-destructive/10 text-destructive"
                    : "border-border bg-card text-secondary hover:border-destructive"
                }`}
              >
                {isFavorite ? "♥" : "♡"} 気になる
              </button>
              <button className="flex-1 py-3 border-2 border-accent bg-accent text-white rounded hover:bg-[#FF7F50] transition-colors">
                出品者に連絡する
              </button>
            </div>
          </div>
        </div>

        {/* Related Items */}
        <section className="mt-12">
          <h3 className="mb-4 text-primary">同じカテゴリの出品</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <button
                key={i}
                onClick={() => onNavigate("item-detail")}
                className="border border-border bg-card hover:shadow-md transition-all text-left rounded-lg overflow-hidden"
              >
                <div className="w-full h-32 border-b border-border bg-muted flex items-center justify-center">
                  <div className="w-12 h-12 border-2 border-primary/30 rounded"></div>
                </div>
                <div className="p-3">
                  <p className="text-sm mb-1 text-foreground">関連商品 {i}</p>
                  <p className="text-sm text-accent">¥5,000</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
