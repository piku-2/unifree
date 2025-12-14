import { Header } from "./Header";

type LoginProps = {
  onNavigate: (page: string) => void;
};

export function Login({ onNavigate }: LoginProps) {
  const handleGoogleLogin = () => {
    // Google OAuth ログイン処理（将来的に signInWithGoogle に差し替え）
    alert("Googleログインを実行します");
    onNavigate("home");
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-background">
      <Header title="ログイン" onNavigate={onNavigate} showBack />

      <main className="max-w-md mx-auto px-4 py-12">
        <div className="border border-border bg-card p-8 rounded-lg shadow-sm">
          <div className="text-center mb-8">
            <div className="w-20 h-20 border-2 border-primary rounded-full mx-auto mb-4 bg-info/10"></div>
            <h2 className="text-2xl mb-2 text-primary">ユニフリ</h2>
            <p className="text-sm text-secondary">学内フリマアプリ</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 border-2 border-primary bg-primary text-white rounded hover:bg-[#5A8BFF] transition-colors flex items-center justify-center gap-3"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Googleでログイン
            </button>

            <p className="text-xs text-center text-secondary">
              Googleアカウントを使用してログインします
            </p>
          </div>
        </div>

        <div className="mt-8 border border-warning bg-warning/10 p-4 rounded-lg">
          <h4 className="text-sm mb-2 text-foreground">📢 ご利用にあたって</h4>
          <ul className="text-xs space-y-1 text-secondary">
            <li>・大学のメールアドレスでの登録が必要です</li>
            <li>・取引は対面での受け渡しのみとなります</li>
            <li>・個人情報の取り扱いには十分ご注意ください</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
