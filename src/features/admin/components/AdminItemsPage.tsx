import Header from '@/components/Header';
import { NavigateHandler } from '@/config/navigation';

type AdminItemsPageProps = {
  onNavigate: NavigateHandler;
};

export function AdminItemsPage({ onNavigate }: AdminItemsPageProps) {
  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-background">
      <Header title="イベント商品登録" onNavigate={onNavigate} showBack />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <section className="border border-border bg-card p-6 rounded-lg shadow-sm space-y-3">
          <h2 className="text-lg text-primary">イベント情報</h2>
          <p className="text-sm text-secondary">
            イベント名・日付・説明を設定してから商品を登録します。管理者のみアクセス可能です。
          </p>
        </section>

        <section className="border border-border bg-card p-6 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base text-primary">商品登録</h3>
            <button
              type="button"
              className="px-4 py-2 border border-border rounded bg-muted text-secondary hover:border-primary"
            >
              下書き保存
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-secondary">
            <div className="space-y-2">
              <p>タイトル / 説明 / 価格 / カテゴリ / 画像1枚を入力して登録します。</p>
              <p>一括登録（CSV）や単品登録フォームをここに配置します。</p>
            </div>
            <div className="border border-dashed border-border p-4 rounded-lg bg-muted/40 text-center">
              フォームUI実装スペース
            </div>
          </div>
        </section>

        <section className="border border-border bg-card p-6 rounded-lg shadow-sm">
          <h3 className="text-base text-primary mb-4">登録済み商品一覧</h3>
          <div className="text-sm text-secondary">
            出品の下書き／公開ステータスや在庫を管理するテーブルをここに配置します。
          </div>
        </section>
      </main>
    </div>
  );
}
