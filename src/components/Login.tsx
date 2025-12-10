import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Header } from './Header';
import { supabase } from '@/libs/supabase/client';
import { ROUTES } from '@/config/routes';
import { NavigateHandler } from '@/config/navigation';

type LoginProps = {
  // onNavigate preserved for backward compat if needed, but we use router mainly
  onNavigate?: NavigateHandler;
};

export function Login({ onNavigate }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      navigate(ROUTES.HOME);
    } catch (err) {
      alert('予期せぬエラーが発生しました');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm mb-2 text-foreground">
                学生メールアドレス
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@student.university.ac.jp"
                className="w-full p-3 border border-border rounded bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-secondary mt-2">
                ※大学発行のメールアドレスのみ使用可能です
              </p>
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground">
                パスワード
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 border border-border rounded bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 border-2 border-accent bg-accent text-white rounded hover:bg-[#FF7F50] transition-colors"
            >
              ログイン
            </button>
          </form>

          <div className="mt-6 text-center">
            <button className="text-sm underline text-primary hover:text-[#5A8BFF]">
              パスワードを忘れた方
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm mb-4 text-secondary">アカウントをお持ちでない方</p>
            <button
              onClick={() => onNavigate('register')}
              className="w-full py-3 border-2 border-primary bg-card text-primary rounded hover:bg-primary hover:text-white transition-colors"
            >
              新規登録
            </button>
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
