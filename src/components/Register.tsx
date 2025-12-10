import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Header } from './Header';
import { supabase } from '@/libs/supabase/client';
import { ROUTES } from '@/config/routes';
import { NavigateHandler } from '@/config/navigation';

type RegisterProps = {
  onNavigate?: NavigateHandler;
};

export function Register({ onNavigate }: RegisterProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('パスワードが一致しません');
      return;
    }
    if (!formData.agreedToTerms) {
      alert('利用規約に同意してください');
      return;
    }

    // Domain check
    if (!formData.email.endsWith('.ac.jp')) {
      alert('大学発行のメールアドレス（.ac.jp）のみ登録可能です');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            department: formData.department,
          },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert('登録確認メールを送信しました。メールを確認してログインしてください。');
      // Per requirements: "signUp 成功後はそのまま ... /mypage へ遷移"
      // However, typical Supabase flow requires email confirmation.
      // If auto-confirm is OFF, they are not logged in.
      // If we redirect to MyPage (protected), AuthGate will bounce them to Login.
      // This is acceptable behavior for "check your email".
      navigate(ROUTES.MYPAGE);
    } catch (err) {
      alert('エラーが発生しました');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-background">
      <Header title="新規登録" onNavigate={onNavigate} showBack />

      <main className="max-w-md mx-auto px-4 py-12">
        <div className="border border-border bg-card p-8 rounded-lg shadow-sm">
          <div className="text-center mb-8">
            <div className="w-20 h-20 border-2 border-primary rounded-full mx-auto mb-4 bg-info/10"></div>
            <h2 className="text-2xl mb-2 text-primary">ユニフリ新規登録</h2>
            <p className="text-sm text-secondary">学生メールアドレスで登録</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm mb-2 text-foreground">
                名前 <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="例：田中太郎"
                className="w-full p-3 border border-border rounded bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground">
                学部・学年 <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="例：工学部3年"
                className="w-full p-3 border border-border rounded bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground">
                学生メールアドレス <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@student.university.ac.jp"
                className="w-full p-3 border border-border rounded bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-secondary mt-2">
                ※大学発行のメールアドレスのみ使用可能です
              </p>
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground">
                パスワード <span className="text-destructive">*</span>
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="8文字以上"
                className="w-full p-3 border border-border rounded bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-foreground">
                パスワード（確認） <span className="text-destructive">*</span>
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="もう一度入力してください"
                className="w-full p-3 border border-border rounded bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="border border-border p-4 bg-muted rounded">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                  className="w-5 h-5 mt-1 flex-shrink-0 accent-primary"
                />
                <span className="text-sm text-foreground">
                  <span className="underline text-primary">利用規約</span>および
                  <span className="underline text-primary">プライバシーポリシー</span>
                  に同意します
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 border-2 border-accent bg-accent text-white rounded hover:bg-[#FF7F50] transition-colors"
            >
              登録する
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm mb-4 text-secondary">既にアカウントをお持ちの方</p>
            <button
              onClick={() => onNavigate('login')}
              className="w-full py-3 border-2 border-primary bg-card text-primary rounded hover:bg-primary hover:text-white transition-colors"
            >
              ログイン
            </button>
          </div>
        </div>

        <div className="mt-8 border border-warning bg-warning/10 p-4 rounded-lg">
          <h4 className="text-sm mb-2 text-foreground">⚠️ 重要事項</h4>
          <ul className="text-xs space-y-1 text-secondary">
            <li>・登録には大学のメールアドレスが必要です</li>
            <li>・本人確認のため、学生証の提示が必要な場合があります</li>
            <li>・トラブル防止のため、個人情報の取り扱いには十分ご注意ください</li>
            <li>・営利目的での利用は禁止されています</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
