import { Header } from '@/components/Header';
import { NavigateHandler } from '@/config/navigation';

type AdminOrdersPageProps = {
  onNavigate: NavigateHandler;
};

export function AdminOrdersPage({ onNavigate }: AdminOrdersPageProps) {
  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-background">
      <Header title="申請管理" onNavigate={onNavigate} showBack />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <section className="border border-border bg-card p-6 rounded-lg shadow-sm grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-secondary mb-2">申請総数</p>
            <p className="text-2xl text-primary">—</p>
          </div>
          <div>
            <p className="text-xs text-secondary mb-2">未対応 / 承認済み</p>
            <p className="text-2xl text-primary">—</p>
          </div>
        </section>

        <section className="border border-border bg-card p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base text-primary">申請一覧</h3>
            <div className="flex gap-2">
              <select className="p-2 border border-border rounded bg-card text-sm">
                <option>すべて</option>
                <option>未対応</option>
                <option>承認済み</option>
                <option>却下</option>
              </select>
              <button className="px-3 py-2 border border-border rounded bg-muted text-sm hover:border-primary">
                エクスポート
              </button>
            </div>
          </div>
          <div className="border border-dashed border-border rounded-lg p-4 text-sm text-secondary bg-muted/40">
            申請の一覧テーブル（購入申請者・商品・ステータス・更新日）をここに配置します。
          </div>
        </section>
      </main>
    </div>
  );
}
