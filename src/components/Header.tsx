"use client";

import { NavigateHandler } from "@/config/navigation";
import { useAuth } from "@/features/user/hooks/useAuth";

type HeaderProps = {
  title?: string;
  onNavigate?: NavigateHandler;
  showBack?: boolean;
};

export default function Header({ title, onNavigate, showBack }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* 左側 */}
        <div className="flex items-center gap-3">
          {showBack && onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate("home")}
              className="flex items-center justify-center w-10 h-10 rounded hover:bg-muted transition"
              aria-label="戻る"
            >
              ←
            </button>
          )}

          {title && (
            <h1 className="text-lg font-bold text-primary leading-none">
              {title}
            </h1>
          )}
        </div>

        {/* 右側（表示のみ） */}
        {user && (
          <div
            className="w-10 h-10 rounded-full bg-muted overflow-hidden flex items-center justify-center"
            title="プロフィール（MVPでは操作不可）"
          >
            {user.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-secondary">U</span>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
