import { Item } from '@/features/items/types';
import { MyItemCard } from './MyItemCard';

type MyItemListProps = {
  items: Item[];
  loading: boolean;
  onItemClick: (itemId: string) => void;
  onDelete: (itemId: string) => void;
  onEdit: (itemId: string) => void;
};

export function MyItemList({ items, loading, onItemClick, onDelete, onEdit }: MyItemListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-secondary">
        出品した商品はまだありません
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <MyItemCard
          key={item.id}
          item={item}
          onClick={() => onItemClick(item.id)}
          onDelete={() => onDelete(item.id)}
          onEdit={() => onEdit(item.id)}
        />
      ))}
    </div>
  );
}
