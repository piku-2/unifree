import { redirect } from 'next/navigation';
import Link from 'next/link';
import { supabaseServerClient } from '../../lib/supabase/server';

export default async function AdminPage() {
  const supabase = supabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = (user?.app_metadata as any)?.role;
  if (!user || role !== 'admin') redirect('/');

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">管理ダッシュボード</h1>
      <div className="space-x-3">
        <Link href="/admin/items" className="underline text-blue-600">
          イベント商品登録
        </Link>
        <Link href="/admin/orders" className="underline text-blue-600">
          申請管理
        </Link>
      </div>
    </main>
  );
}
