export default function ItemDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Item Detail (placeholder)</h1>
      <p>Item ID: {params.id}</p>
      <p>サーバーアクション経由で商品詳細を取得する予定です。</p>
    </main>
  );
}
