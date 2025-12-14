import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { NavigateHandler } from '@/config/navigation';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { ProfileImageUploader } from './ProfileImageUploader';

type ProfileEditPageProps = {
  onNavigate: NavigateHandler;
};

export function ProfileEditPage({ onNavigate }: ProfileEditPageProps) {
  const { user, refreshUser } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setDisplayName(user.user_metadata?.name ?? '');
    setBio(user.user_metadata?.bio ?? '');
    setAvatarUrl(user.user_metadata?.avatar_url ?? null);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(
          [
            {
              id: user.id,
              username: displayName || null,
              avatar_url: avatarUrl,
              updated_at: new Date().toISOString(),
            },
          ] as any,
        );

      if (profileError) {
        throw profileError;
      }

      const { error: authError } = await supabase.auth.updateUser({
        data: {
          name: displayName || null,
          bio,
          avatar_url: avatarUrl,
        },
      });

      if (authError) {
        throw authError;
      }

      await refreshUser();
      alert('プロフィールを更新しました');
      onNavigate('mypage');
    } catch (error) {
      console.error(error);
      alert('プロフィールの更新に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-background">
      <Header title="プロフィール編集" onNavigate={onNavigate} showBack />

      <main className="max-w-3xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="border border-border bg-card p-6 rounded-lg shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">プロフィール画像</h2>
            <ProfileImageUploader
              initialUrl={avatarUrl}
              onUploaded={(url) => setAvatarUrl(url)}
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-foreground">名前</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-3 border border-border rounded bg-card"
              placeholder="表示名を入力"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-foreground">自己紹介</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full p-3 border border-border rounded bg-card"
              placeholder="自己紹介や活動内容を入力"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onNavigate('mypage')}
              className="flex-1 py-3 border-2 border-border rounded hover:bg-muted transition-colors disabled:opacity-50"
              disabled={saving}
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-primary text-white rounded hover:bg-[#5A8BFF] transition-colors disabled:opacity-50"
            >
              {saving ? '保存中...' : '保存する'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
