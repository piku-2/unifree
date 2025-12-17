import { redirect } from 'next/navigation';
import { adminCreateItem } from '@/actions/admin';
import { supabaseServerClient } from '../../../lib/supabase/server';

export default async function AdminItemsPage() {
  const supabase = supabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = (user?.app_metadata as any)?.role;
  if (!user || role !== 'admin') redirect('/');

  async function handleCreate(formData: FormData) {
    'use server';
    await adminCreateItem({
      title: String(formData.get('title') ?? ''),
      description: String(formData.get('description') ?? ''),
      price: Number(formData.get('price') ?? 0),
      category: String(formData.get('category') ?? ''),
      status: (formData.get('status') as any) ?? 'selling',
      image_url: String(formData.get('image_url') ?? '') || null,
    });
  }

  return (
    <main className="p-6 space-y-4 max-w-2xl">
      <h1 className="text-2xl font-bold">イベント商品登録</h1>
      <form action={handleCreate} className="space-y-3">
        <label className="block text-sm">
          タイトル
          <input name="title" required className="w-full border rounded p-2 mt-1" />
        </label>
        <label className="block text-sm">
          説明
          <textarea name="description" required className="w-full border rounded p-2 mt-1" />
        </label>
        <label className="block text-sm">
          価格
          <input type="number" name="price" required className="w-full border rounded p-2 mt-1" />
        </label>
        <label className="block text-sm">
          カテゴリ
          <input name="category" required className="w-full border rounded p-2 mt-1" />
        </label>
        <label className="block text-sm">
          画像URL
          <input name="image_url" className="w-full border rounded p-2 mt-1" />
        </label>
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">
          登録する
        </button>
      </form>
    </main>
  );
}
