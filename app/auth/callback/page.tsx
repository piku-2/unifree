"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [message, setMessage] = useState("認証処理中です…");

  useEffect(() => {
    const code = searchParams.get("code");
    const errorDesc = searchParams.get("error_description");

    if (errorDesc) {
      setStatus("error");
      setMessage(errorDesc);
      return;
    }

    if (!code) {
      setStatus("error");
      setMessage("コードがありません。メールのリンクを再度開いてください。");
      return;
    }

    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error }) => {
        if (error) {
          throw error;
        }
        setStatus("success");
        setMessage("ログインしました。トップへ移動します。");
        setTimeout(() => router.push("/"), 600);
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
        setMessage("ログインに失敗しました。");
      });
  }, [router, searchParams]);

  return (
    <main className="max-w-md mx-auto p-6 space-y-4 text-center">
      <h1 className="text-2xl font-bold">ログイン処理</h1>
      <p className="text-sm text-gray-600">{message}</p>
      {status === "error" && (
        <button
          onClick={() => router.push("/login")}
          className="mt-4 px-4 py-2 border rounded text-blue-600 border-blue-600"
        >
          ログインに戻る
        </button>
      )}
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="max-w-md mx-auto p-6 space-y-4 text-center">
          <h1 className="text-2xl font-bold">ログイン処理</h1>
          <p className="text-sm text-gray-600">認証処理中です…</p>
        </main>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
