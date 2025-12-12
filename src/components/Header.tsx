import { NavigateHandler } from '@/config/navigation';
import { useAuth } from '@/features/user/hooks/useAuth';

type HeaderProps = {
  title: string;
  onNavigate: NavigateHandler;
  showBack?: boolean;
};

export function Header({ title, onNavigate, showBack = false }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <button onClick={() => onNavigate('home')} className="w-8 h-8 border-2 border-primary text-primary flex items-center justify-center rounded hover:bg-primary hover:text-white transition-colors">
              &lt;
            </button>
          )}
          <h1 className="text-xl text-primary">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <button
              onClick={() => onNavigate('sell')}
              className="px-4 py-2 border-2 border-accent bg-accent text-white rounded hover:bg-[#FF7F50] transition-colors"
            >
              出品する
            </button>
          )}
          {user ? (
            <button
              onClick={() => onNavigate('mypage')}
              className="w-10 h-10 border-2 border-border rounded-full bg-muted flex items-center justify-center overflow-hidden hover:border-primary transition-colors hover:shadow-md"
            >
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm text-secondary">My</span>
              )}
            </button>
          ) : (
            <button onClick={() => onNavigate('login')} className="px-4 py-2 border-2 border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors">
              ログイン
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
