"use client";

import { useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { supabase } from "@/lib/supabase/client";
import { NavigateHandler } from "@/config/navigation";

type LoginProps = {
  onNavigate?: NavigateHandler;
};

export function Login({ onNavigate }: LoginProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fallbackNavigate: NavigateHandler = (page, params) => {
    switch (page) {
      case "home":
        router.push("/");
        return;
      case "login":
        router.push("/login");
        return;
      case "sell":
        router.push("/sell");
        return;
      case "mypage":
        router.push("/mypage");
        return;
      case "item-detail":
        if (params?.itemId) {
          router.push(`/items/${params.itemId}`);
        } else {
          router.push("/");
        }
        return;
      case "item-list":
        router.push("/");
        return;
      case "chat":
        router.push("/chat");
        return;
      default:
        router.push("/");
    }
  };

  const handleNavigate = onNavigate ?? fallbackNavigate;

  const isAcDomain = (value: string) => value.endsWith(".ac.jp");

  const handleEmailLogin = async (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setErrorMessage("");

    const normalizedEmail = email.trim();
    if (!normalizedEmail || !isAcDomain(normalizedEmail)) {
      setIsOtpSent(false);
      setErrorMessage(
        "大学ドメイン（@xxx.ac.jp）のメールアドレスを入力してください"
      );
      return;
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (!siteUrl) {
      console.error("NEXT_PUBLIC_SITE_URL is not configured");
      setIsOtpSent(false);
      setErrorMessage(
        "メール送信に失敗しました。しばらくしてから再試行してください。"
      );
      return;
    }

    setIsLoading(true);
    try {
      const emailRedirectTo = `${siteUrl}/auth/callback`;
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          emailRedirectTo,
          shouldCreateUser: true,
        },
      });
      if (error) throw error;
      setIsOtpSent(true);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        "メール送信に失敗しました。しばらくしてから再試行してください。"
      );
      setIsOtpSent(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-background">
      <Header title="ログイン" onNavigate={handleNavigate} showBack />

      <main className="max-w-md mx-auto px-4 py-12">
        <div className="border border-border bg-card p-8 rounded-lg shadow-sm">
          <div className="text-center mb-8">
            <div className="w-20 h-20 border-2 border-primary rounded-full mx-auto mb-4 bg-info/10"></div>
            <h2 className="text-2xl mb-2 text-primary">ユニフリ</h2>
            <p className="text-sm text-secondary">学内フリマアプリ</p>
          </div>

          <form className="space-y-4 mb-6" onSubmit={handleEmailLogin}>
            <div>
              <label className="block text-sm mb-2 text-foreground">
                大学メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-border rounded bg-card"
                placeholder="you@example.ac.jp"
                required
              />
            </div>

            {errorMessage && (
              <p className="text-destructive text-sm">{errorMessage}</p>
            )}

            {isOtpSent && (
              <p className="text-sm text-primary">
                認証メールを送信しました。メール内のリンクからログインしてください。
              </p>
            )}

            <button
              type="submit"
              onClick={handleEmailLogin}
              disabled={isLoading}
              className="w-full py-3 border-2 border-primary bg-primary text-white rounded hover:bg-[#5A8BFF] transition-colors disabled:opacity-50"
            >
              {isLoading ? "送信中..." : "メールでログイン"}
            </button>
          </form>
        </div>

        <div className="mt-8 border border-warning bg-warning/10 p-4 rounded-lg">
          <h4 className="text-sm mb-2 text-foreground">ご利用にあたって</h4>
          <ul className="text-xs space-y-1 text-secondary">
            <li>・大学のメールアドレスでの登録が必要です</li>
            <li>・取引は対面での受け渡しのみとなります</li>
            <li>・個人情報の取り扱いには十分ご注意ください</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
