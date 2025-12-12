'use client';

import { FormEvent, useMemo, useState } from 'react';
import { supabaseBrowserClient } from '../../lib/supabase/client';

export default function LoginPage() {
  const supabase = useMemo(() => supabaseBrowserClient(), []);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    const redirectTo = `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      setStatus('error');
      setErrorMessage(error.message);
      return;
    }

    setStatus('sent');
  };

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">ログイン</h1>
      <p className="text-sm text-gray-600">大学メールで Magic Link を送信します。</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-sm">
          メールアドレス
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full border rounded p-2"
            placeholder="you@example.ac.jp"
          />
        </label>

        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        {status === 'sent' && <p className="text-sm text-green-600">メールを送信しました。</p>}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full bg-blue-600 text-white rounded py-2 disabled:opacity-60"
        >
          {status === 'sending' ? '送信中…' : 'Magic Link を送る'}
        </button>
      </form>
    </main>
  );
}
