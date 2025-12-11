'use client';

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function ItemsError({ reset }: ErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="border border-border bg-card rounded-lg p-6 text-center space-y-3">
        <p className="text-foreground font-semibold">読み込みに失敗しました。</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-[#5A8BFF] transition-colors"
        >
          再試行
        </button>
      </div>
    </div>
  );
}
