import { Item } from '../types';

type ItemCardProps = {
  item: Item;
  onClick: (id: string) => void;
};

export function ItemCard({ item, onClick }: ItemCardProps) {
  // Use first image or placeholder
  const imageUrl = item.images && item.images.length > 0 ? item.images[0] : null;
  const isSold = item.status === 'sold_out' || item.status === 'sold';
  const isReserved = item.status === 'reserved' || item.status === 'trading';

  return (
    <button
      onClick={() => onClick(item.id)}
      className="border border-border bg-card hover:shadow-md transition-all text-left rounded-lg overflow-hidden w-full h-full flex flex-col"
    >
      <div className="w-full aspect-square border-b border-border bg-muted flex items-center justify-center relative overflow-hidden">
        {imageUrl ? (
            <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
             <div className="w-20 h-20 border-2 border-primary/30 rounded"></div>
        )}
        {isSold && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg rotate-[-15deg]">
            SOLD OUT
          </div>
        )}
        {!isSold && isReserved && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white font-bold text-lg rotate-[-15deg]">
            RESERVED
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-1 border border-border rounded bg-muted text-secondary">{item.category}</span>
           {/* 'isLarge' is not in Item type yet, but assuming we can derive it or ignore for now if DB doesn't have it.
               The user schema/types defined earlier didn't have isLarge. I will omit or check if description tags it.
               For now, I'll stick to types.ts definition. */}
        </div>
        <h4 className="mb-2 text-foreground line-clamp-2 flex-grow">{item.title}</h4>
        <p className="text-xl text-accent">¥{item.price.toLocaleString()}</p>
      </div>
    </button>
  );
}
