import Link from 'next/link';
import { createServerClientInstance } from '@/app/lib/supabase/server-client';
import { requireServerUser } from '@/app/lib/auth/require-auth';
import { ProfileForm } from './profile-form';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await requireServerUser();
  const supabase = createServerClientInstance();

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    console.error('profile fetch failed', error);
  }

  const username = profile?.username ?? '';
  const avatarUrl = profile?.avatar_url ?? null;

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-primary font-semibold">プロフィール編集</h1>
            <p className="text-sm text-secondary">表示名とアバター画像を更新します。</p>
          </div>
          <Link href="/mypage" className="text-sm text-primary hover:underline">
            マイページへ戻る
          </Link>
        </div>

        <div className="border border-border rounded-lg bg-card p-6">
          <ProfileForm initialUsername={username} initialAvatarUrl={avatarUrl} />
        </div>
      </main>
    </div>
  );
}
