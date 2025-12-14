import { Header } from "./Header";
import { supabase } from "@/lib/supabase/client";

type LoginProps = {
  onNavigate: (page: string) => void;
};

export function Login({ onNavigate }: LoginProps) {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
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
              Googleでログイン
            </button>

            <p className="text-xs text-center text-secondary">
              Googleアカウントを使用してログインします
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
