'use client';

import { ReactNode, useEffect } from 'react';
import { useInAppBrowser } from '@/lib/hooks/useInAppBrowser';

type InAppBrowserGateProps = {
  children: ReactNode;
};

export function InAppBrowserGate({ children }: InAppBrowserGateProps) {
  const { isInAppBrowser, checked } = useInAppBrowser();

  useEffect(() => {
    if (checked && isInAppBrowser) {
      alert(
        'LINEやInstagramなどのアプリ内ブラウザではGoogleログインがブロックされます。SafariまたはChromeで開き直してください。',
      );
    }
  }, [checked, isInAppBrowser]);

  if (!checked) {
    return null;
  }

  if (isInAppBrowser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="max-w-md w-full border border-border bg-card rounded-lg p-6 text-center space-y-4 shadow-sm">
          <h1 className="text-xl font-semibold text-primary">ブラウザを開き直してください</h1>
          <p className="text-sm text-secondary">
            LINE・Instagram・Twitter、Discord などのアプリ内ブラウザでは Google でのログインがブロックされます。
          </p>
          <div className="text-sm text-foreground space-y-2">
            <p>1. 右上のメニューから「Safariで開く」または「Chromeで開く」を選択してください。</p>
            <p>2. 開き直したブラウザでもう一度 QR コードの URL を開いてください。</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
