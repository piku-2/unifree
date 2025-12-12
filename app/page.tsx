import Link from 'next/link';
import { getItems } from './actions/items';

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const category = searchParams?.category;
  const items = await getItems(category ? { category } : {});

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">出品一覧</h1>
          <p className="text-sm text-gray-600">カテゴリ絞り込み付きの一覧</p>
        </div>
        <Link href="/sell" className="px-4 py-2 rounded bg-blue-600 text-white">
          出品する
        </Link>
      </header>

      <div className="flex gap-4 items-center">
        <span className="text-sm">カテゴリ:</span>
        <Link
          href="/"
          className={`px-3 py-1 rounded border ${!category ? 'bg-blue-50 border-blue-300' : 'border-gray-300'}`}
        >
          すべて
        </Link>
        {['家電', '本', '生活雑貨', '大型家具', 'その他'].map((c) => (
          <Link
            key={c}
            href={`/?category=${encodeURIComponent(c)}`}
            className={`px-3 py-1 rounded border ${category === c ? 'bg-blue-50 border-blue-300' : 'border-gray-300'}`}
          >
            {c}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500">出品がありません。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/items/${item.id}`}
              className="border rounded p-4 hover:shadow"
            >
              <p className="text-xs text-gray-500 mb-1">{item.category}</p>
              <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
              <p className="text-xl text-blue-600">¥{item.price.toLocaleString()}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
