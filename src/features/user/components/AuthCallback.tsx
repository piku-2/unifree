import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { supabase } from '@/libs/supabase/client';
import { ROUTES } from '@/config/routes';
import { NavigateHandler } from '@/config/navigation';

type AuthCallbackProps = {
  onNavigate?: NavigateHandler;
};

export function AuthCallback({ onNavigate }: AuthCallbackProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('認証処理中です...');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorDescription = params.get('error_description');
    if (errorDescription) {
      setStatus('error');
      setMessage(errorDescription);
      return;
    }

    const code = params.get('code');
    if (!code) {
      setStatus('error');
      setMessage('認証コードが見つかりませんでした。再度メールリンクを開いてください。');
      return;
    }

    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error }) => {
        if (error) throw error;
        setStatus('success');
        setMessage('ログインしました。トップに移動します。');
        setTimeout(() => {
          if (onNavigate) {
            onNavigate('home');
          } else {
            navigate(ROUTES.HOME, { replace: true });
          }
        }, 600);
      })
      .catch((err) => {
        console.error(err);
        setStatus('error');
        setMessage('ログインに失敗しました。もう一度お試しください。');
      });
  }, [location.search, navigate, onNavigate]);

  const handleRetry = () => {
    if (onNavigate) {
      onNavigate('login');
    } else {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-background">
      <Header title="ログイン処理中" onNavigate={onNavigate ?? (() => {})} showBack />

      <main className="max-w-md mx-auto px-4 py-12">
        <div className="border border-border bg-card p-6 rounded-lg shadow-sm text-center space-y-4">
          <div className="flex justify-center">
            {status === 'pending' ? (
              <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
            ) : (
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  status === 'success'
                    ? 'bg-primary text-white'
                    : 'bg-destructive/10 text-destructive'
                }`}
              >
                {status === 'success' ? '✓' : '!'}
              </div>
            )}
          </div>

          <div>
            <p className="text-lg text-foreground">{message}</p>
            {status === 'error' && (
              <button
                onClick={handleRetry}
                className="mt-4 px-4 py-2 border-2 border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors"
              >
                ログイン画面に戻る
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
