import { Item } from "@/features/items/types";

type ItemCardProps = {
  item: Item;
  onClick?: () => void;
};

export function ItemCard({ item, onClick }: ItemCardProps) {
  const imageUrl = item.image_url ?? null;

  const isSold = item.status === "sold";
  const isReserved = item.status === "reserved";

  return (
    <button
      onClick={onClick}
      className="border border-border bg-card hover:shadow-md transition-shadow text-left rounded-lg overflow-hidden relative"
    >
      {/* 画像 */}
      <div className="w-full h-48 border-b border-border bg-muted flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 border-2 border-primary/30 rounded" />
        )}
      </div>

      {/* SOLD / RESERVED バッジ */}
      {(isSold || isReserved) && (
        <div className="absolute top-2 left-2 px-2 py-1 text-xs text-white rounded bg-black/70">
          {isSold ? "SOLD" : "取引中"}
        </div>
      )}

      {/* テキスト */}
      <div className="p-4">
        {item.category && (
          <p className="text-xs mb-1 text-secondary">{item.category}</p>
        )}
        <h4 className="mb-2 text-foreground line-clamp-2">{item.title}</h4>
        <p className="text-xl text-accent">¥{item.price.toLocaleString()}</p>
      </div>
    </button>
  );
}
