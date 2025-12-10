type SellerInfoProps = {
  seller?: {
    name: string;
    department?: string; // Not in DB type explicitly yet, but useful
    avatar_url?: string;
  };
};

export function SellerInfo({ seller }: SellerInfoProps) {
  if (!seller) return null;

  return (
    <div className="border border-border p-4 bg-card rounded-lg">
      <h3 className="text-sm mb-3 text-primary">出品者</h3>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 border-2 border-border rounded-full bg-muted overflow-hidden">
            {seller.avatar_url ? (
                <img src={seller.avatar_url} alt={seller.name} className="w-full h-full object-cover" />
            ) : null}
        </div>
        <div>
          <p className="text-foreground">{seller.name}</p>
          {seller.department && <p className="text-xs text-secondary">{seller.department}</p>}
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm text-secondary">
        {/* Placeholder stats as they are not in ItemWithUser yet */}
        <span>⭐ 4.5</span>
        <span>出品数：5件</span>
      </div>
    </div>
  );
}
