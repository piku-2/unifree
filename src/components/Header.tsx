type HeaderProps = {
  title: string;
  onNavigate: (page: string) => void;
  showBack?: boolean;
};

export function Header({ title, onNavigate, showBack = false }: HeaderProps) {
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
          <button className="w-8 h-8 border-2 border-border rounded-full bg-muted"></button>
          <button onClick={() => onNavigate('login')} className="hidden md:block px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors">
            ログイン
          </button>
        </div>
      </div>
    </header>
  );
}