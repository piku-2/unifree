import { ItemWithUser } from "@/features/items/types";

type MyItemCardProps = {
  item: ItemWithUser;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function MyItemCard({
  item,
  onClick,
  onEdit,
  onDelete,
}: MyItemCardProps) {
  const isSelling = item.status === "selling";
  const isReserved = item.status === "reserved";
  const isSold = item.status === "sold";

  return (
    <div
      className="border border-border bg-card rounded-lg p-4 space-y-3 hover:shadow-sm transition"
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-foreground line-clamp-1">
          {item.title}
        </h4>

        {isSelling && (
          <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
            出品中
          </span>
        )}
        {isReserved && (
          <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">
            取引中
          </span>
        )}
        {isSold && (
          <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-600">
            売却済み
          </span>
        )}
      </div>

      <p className="text-sm text-secondary line-clamp-2">{item.description}</p>

      <div className="flex justify-between items-center">
        <span className="text-accent font-bold">
          ¥{item.price.toLocaleString()}
        </span>

        <div className="flex gap-2">
          {isSelling && onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="text-xs text-primary hover:underline"
            >
              編集
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-xs text-destructive hover:underline"
            >
              削除
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
