"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createItem } from "../api/createItem";
import { useAuth } from "@/features/user/hooks/useAuth";
import { ROUTES } from "@/config/routes";
import { CreateItemInput } from "../types";

export function useItemForm() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (formData: FormData) => {
    if (!user) {
      setError("ログインが必要です");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // FormData → ドメイン型に変換（責務分離◎）
      const input: CreateItemInput = {
        title: String(formData.get("title") ?? ""),
        description: String(formData.get("description") ?? ""),
        price: Number(formData.get("price") ?? 0),
        condition: String(formData.get("condition") ?? ""),
      };

      await createItem(input);
      router.push(ROUTES.MYPAGE);
    } catch (e) {
      setError(e instanceof Error ? e.message : "出品に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return {
    submit,
    loading,
    error,
  };
}
