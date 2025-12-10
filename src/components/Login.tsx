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


  const [isLoading, setIsLoading] = useState(false);



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

          <div className="space-y-6">
            <button
              onClick={async () => {
                setIsLoading(true);
                try {
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                      queryParams: {
                        hd: 'ac.jp',
                      },
                      redirectTo: `${window.location.origin}/auth/callback`,
                    },
                  });
                  if (error) throw error;
                } catch (err) {
                  alert('ログインに失敗しました');
                  console.error(err);
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              className="w-full py-3 border-2 border-border bg-white text-foreground rounded hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              <span>Googleでログイン</span>
            </button>

            <p className="text-sm text-center text-secondary">
              ※大学発行のGoogleアカウント(@ac.jp)のみ利用可能です
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
