import Link from 'next/link';
import { createServerClientInstance } from '@/app/lib/supabase/server-client';

type Item = {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
};

export const dynamic = 'force-dynamic';

export default async function ItemsPage() {
  const supabase = createServerClientInstance();
  const { data: items, error } = await supabase
    .from('items')
    .select('id, title, price, image_url')
    .eq('status', 'selling')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch items', error);
    return (
      <div className="min-h-screen bg-background">
        <main className="max-w-5xl mx-auto px-4 py-10">
          <p className="text-destructive">商品一覧の取得に失敗しました。</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl text-primary font-semibold">商品一覧</h1>
          <p className="text-sm text-secondary">販売中の商品だけを表示しています。</p>
        </div>

        {items && items.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/items/${item.id}`}
                className="block border border-border rounded-lg bg-card overflow-hidden hover:border-primary transition-colors"
              >
                <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-secondary text-sm">No image</span>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h2 className="text-lg text-foreground font-medium">{item.title}</h2>
                  <p className="text-primary font-semibold">
                    {new Intl.NumberFormat('ja-JP').format(item.price)}円
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border bg-card rounded-lg p-8 text-center text-secondary">
            現在販売中の商品はありません。
          </div>
        )}
      </main>
    </div>
  );
}
