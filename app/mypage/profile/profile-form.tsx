'use client';

import { useState, useTransition } from 'react';
import { updateProfile } from '@/app/actions/profile/update-profile';

type ProfileFormProps = {
  initialUsername: string;
  initialAvatarUrl: string | null;
};

export function ProfileForm({ initialUsername, initialAvatarUrl }: ProfileFormProps) {
  const [username, setUsername] = useState(initialUsername || '');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const res = await updateProfile(formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full border border-border bg-muted overflow-hidden flex items-center justify-center">
          {initialAvatarUrl ? (
            <img src={initialAvatarUrl} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-secondary text-xs">No avatar</span>
          )}
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-sm text-foreground" htmlFor="avatar">
            アバター画像
          </label>
          <input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/*"
            className="block text-sm"
            disabled={isPending}
          />
          <p className="text-xs text-secondary">画像を選択すると更新されます</p>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm text-foreground" htmlFor="username">
          ユーザー名
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-border rounded-lg px-3 py-2 bg-card"
          placeholder="あなたの名前"
          required
          disabled={isPending}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#5A8BFF] transition-colors disabled:opacity-70"
      >
        {isPending ? '更新中...' : '保存する'}
      </button>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}
