import { redirect } from 'next/navigation';
import { createItem } from '../actions/items';
import { supabaseServerClient } from '../../lib/supabase/server';

export default async function SellPage() {
  const supabase = supabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  async function handleCreate(formData: FormData) {
    'use server';
    await createItem(formData);
    redirect('/');
  }

  return (
    <main className="p-6 space-y-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">出品する</h1>
      <form action={handleCreate} className="space-y-4" encType="multipart/form-data">
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
          <input name="price" type="number" min={0} required className="w-full border rounded p-2 mt-1" />
        </label>
        <label className="block text-sm">
          カテゴリ
          <input name="category" required className="w-full border rounded p-2 mt-1" />
        </label>
        <label className="block text-sm">
          画像
          <input name="image" type="file" accept="image/*" className="mt-1" />
        </label>
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">
          出品する
        </button>
      </form>
    </main>
  );
}
