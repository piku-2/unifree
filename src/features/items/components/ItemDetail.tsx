"use client";

import { Header } from "@/components/Header";
import { useAuth } from "@/features/user/hooks/useAuth";
import { ItemWithUser } from "@/features/items/types";
import { NavigateHandler } from "@/config/navigation";

type ItemDetailProps = {
  item: ItemWithUser | null;
  onNavigate: NavigateHandler;
};

export function ItemDetail({ item, onNavigate }: ItemDetailProps) {
  const { user } = useAuth();

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="商品詳細" onNavigate={onNavigate} showBack />
        <div className="p-8 text-center text-secondary">
          商品が見つかりません。
        </div>
      </div>
    );
  }

  const handleChat = () => {
    if (!user) {
      alert("ログインが必要です");
      onNavigate("login");
      return;
    }

    // ✅ 修正点
    if (user.id === item.owner_id) {
      alert("自分の出品商品です");
      return;
    }

    onNavigate("chat", { itemId: item.id });
  };

  return (
    <div className="min-h-screen pb-20 bg-background">
      <Header title="商品詳細" onNavigate={onNavigate} showBack />

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div className="border border-border bg-card rounded-lg overflow-hidden">
          <div className="w-full h-64 bg-muted flex items-center justify-center">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 border-2 border-primary/30 rounded" />
            )}
          </div>

          <div className="p-6 space-y-3">
            {item.category && (
              <p className="text-xs text-secondary">{item.category}</p>
            )}
            <h1 className="text-xl text-foreground">{item.title}</h1>
            <p className="text-2xl text-accent">
              ¥{item.price.toLocaleString()}
            </p>
            {item.description && (
              <p className="text-sm text-secondary">{item.description}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleChat}
          className="w-full py-3 bg-accent text-white rounded font-bold hover:bg-[#FF7F50]"
        >
          出品者に連絡する
        </button>
      </main>
    </div>
  );
}
