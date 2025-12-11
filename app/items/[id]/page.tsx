import { notFound } from 'next/navigation';
import { createServerClientInstance } from '@/app/lib/supabase/server-client';
import { startChat } from '@/app/actions/chat/start-chat';

type Item = {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  image_url: string | null;
};

type ItemDetailPageProps = {
  params: { id: string };
};

export const dynamic = 'force-dynamic';

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const supabase = createServerClientInstance();
  const { data: item, error } = await supabase
    .from('items')
    .select('id, title, description, price, status, image_url')
    .eq('id', params.id)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch item detail', error);
    notFound();
  }

  if (!item) {
    notFound();
  }

  const purchaseAction = startChat.bind(null, item.id);

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-square bg-muted border border-border rounded-lg overflow-hidden flex items-center justify-center">
            {item.image_url ? (
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-secondary text-sm">No image</span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-secondary uppercase tracking-wide">ステータス: {item.status}</p>
              <h1 className="text-2xl text-primary font-semibold mt-1">{item.title}</h1>
            </div>
            <p className="text-foreground leading-relaxed whitespace-pre-line">{item.description}</p>
            <p className="text-2xl text-primary font-bold">{new Intl.NumberFormat('ja-JP').format(item.price)}円</p>

            <form action={purchaseAction}>
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-[#5A8BFF] transition-colors"
              >
                購入申請する
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
