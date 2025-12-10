import { Item } from '../types';

type MyItemCardProps = {
  item: Item;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function MyItemCard({ item, onClick, onEdit, onDelete }: MyItemCardProps) {
  return (
    <div className="w-full border border-border bg-card hover:shadow-md transition-all text-left rounded-lg overflow-hidden flex">
       {/* Main Click Area */}
      <button onClick={onClick} className="flex-1 flex gap-4 p-4 text-left">
        <div className="w-24 h-24 border border-border bg-muted flex-shrink-0 rounded flex items-center justify-center overflow-hidden">
          {item.images && item.images.length > 0 ? (
             <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
          ) : (
             <div className="w-12 h-12 border-2 border-primary/30 rounded"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-1 border border-border rounded bg-muted text-secondary truncate max-w-[100px]">{item.category}</span>
            <span className={`text-xs px-2 py-1 border rounded ${
              item.status === 'on_sale' ? 'bg-info/20 border-info text-primary' : 'bg-muted border-border text-secondary'
            }`}>
              {item.status === 'on_sale' ? '出品中' : item.status}
            </span>
          </div>
          <h4 className="mb-2 text-foreground truncate">{item.title}</h4>
          <p className="text-xl mb-2 text-accent">¥{item.price.toLocaleString()}</p>
        </div>
      </button>

      {/* Actions */}
      <div className="flex flex-col border-l border-border">
          {onEdit && (
            <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="flex-1 px-4 hover:bg-muted text-primary text-sm transition-colors border-b border-border"
            >
                編集
            </button>
          )}
          {onDelete && (
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="flex-1 px-4 hover:bg-destructive/10 text-destructive text-sm transition-colors"
            >
                削除
            </button>
          )}
      </div>
    </div>
  );
}
