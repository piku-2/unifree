"use client";

import { NavigateHandler } from "@/config/navigation";
import { useAuth } from "@/features/user/hooks/useAuth";

type HeaderProps = {
  title?: string;
  onNavigate?: NavigateHandler;
  showBack?: boolean;
};

export function Header({ title, onNavigate, showBack }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* 左側 */}
        <div className="flex items-center gap-2">
          {showBack && onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="text-sm text-primary"
            >
              ←
            </button>
          )}
          <h1 className="text-lg font-bold text-primary">{title}</h1>
        </div>

        {/* 右側 */}
        <div className="flex items-center gap-3">
          {/* ❌ 出品するボタンは MVP 未完成のため非表示 */}
          {/* {user && (
            <button
              onClick={() => onNavigate?.('sell')}
              className="px-4 py-1 text-sm border border-accent text-accent rounded hover:bg-accent hover:text-white"
            >
              出品する
            </button>
          )} */}

          {/* プロフィールアイコン（表示のみ・クリック無効） */}
          {user && (
            <div
              className="w-8 h-8 rounded-full bg-muted overflow-hidden"
              title="プロフィール（MVPでは操作不可）"
            >
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-secondary">
                  U
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
