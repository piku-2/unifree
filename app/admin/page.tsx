import Link from 'next/link';
import { requireAdminUser } from '@/app/lib/auth/require-admin';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  await requireAdminUser();

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div>
          <h1 className="text-2xl text-primary font-semibold">管理者ダッシュボード</h1>
          <p className="text-sm text-secondary">アイテムと取引の管理を行います。</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin/items"
            className="border border-border rounded-lg bg-card p-4 hover:border-primary transition-colors"
          >
            <h2 className="text-lg font-semibold text-foreground mb-1">商品管理</h2>
            <p className="text-sm text-secondary">出品中/取引中/販売済みのステータスを確認・変更</p>
          </Link>

          <Link
            href="/admin/orders"
            className="border border-border rounded-lg bg-card p-4 hover:border-primary transition-colors"
          >
            <h2 className="text-lg font-semibold text-foreground mb-1">取引管理</h2>
            <p className="text-sm text-secondary">購入申請チャットの一覧と完了・キャンセル操作</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
