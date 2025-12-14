import { Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { ROUTES } from '@/config/routes';
import { NavigateHandler } from '@/config/navigation';
import { useAuth } from '@/features/user/hooks/useAuth';

type SellPageProps = {
  onNavigate: NavigateHandler;
};

export function SellPage({ onNavigate }: SellPageProps) {
  const { user, loading } = useAuth();

  if (!loading && !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const handleMove = () => {
    window.location.href = ROUTES.SELL;
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-background">
      <Header title="出品する" onNavigate={onNavigate} showBack />

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <p className="text-sm text-foreground">
          出品フォームは Next.js（/sell）のサーバーアクションに統一されています。下のボタンから新しいフォームへ移動してください。
        </p>
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleMove}
            className="w-full py-3 bg-accent text-white rounded font-bold hover:bg-[#FF7F50]"
          >
            出品フォームへ移動
          </button>
          <p className="text-xs text-muted-foreground text-center">
            うまく遷移しない場合は{' '}
            <a href="/sell" className="text-accent underline">
              /sell
            </a>
            を開いてください。
          </p>
        </div>
      </main>
    </div>
  );
}
