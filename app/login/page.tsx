'use client';

import { useState, useTransition } from 'react';
import { loginWithEmail, loginWithGoogle, logout } from '@/app/actions/auth-actions';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleGoogle = () => {
    setError('');
    setMessage('');
    startTransition(async () => {
      const res = await loginWithGoogle();
      if (res.error) {
        setError(res.error);
        return;
      }
      if (res.url) {
        window.location.href = res.url;
      } else {
        setError('リダイレクトURLの取得に失敗しました');
      }
    });
  };

  const handleEmail = (formData: FormData) => {
    setError('');
    setMessage('');
    startTransition(async () => {
      const res = await loginWithEmail(formData);
      if (res.error) {
        setError(res.error);
        return;
      }
      setMessage('認証メールを送信しました。メールのリンクからログインしてください。');
    });
  };

  const handleLogout = () => {
    setError('');
    setMessage('');
    startTransition(async () => {
      const res = await logout();
      if (res.error) {
        setError(res.error);
        return;
      }
      setMessage('ログアウトしました');
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <div className="w-full max-w-md space-y-4 border border-border bg-card p-6 rounded-lg">
        <h1 className="text-xl text-primary">ログイン</h1>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={isPending}
          className="w-full py-3 border border-border rounded bg-white hover:bg-muted transition-colors"
        >
          {isPending ? '処理中...' : 'Googleでログイン'}
        </button>

        <form action={handleEmail} className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm text-foreground">大学メールアドレス (@ac.jp)</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-border rounded bg-card"
              placeholder="you@example.ac.jp"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 border border-primary bg-primary text-white rounded hover:bg-[#5A8BFF] transition-colors disabled:opacity-50"
          >
            {isPending ? '送信中...' : 'メールでログイン'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isPending}
          className="w-full py-3 border border-destructive text-destructive rounded hover:bg-destructive/10 transition-colors"
        >
          ログアウト
        </button>

        {message && <p className="text-sm text-primary">{message}</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
