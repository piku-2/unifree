"use client";

import { useState } from "react";
import { useAuth } from "@/features/user/hooks/useAuth";
import { useItemForm } from "@/features/items/hooks/useItemForm";
import Header from "@/components/Header";
import { NavigateHandler } from "@/config/navigation";

type ItemFormProps = {
  itemId?: string;
  onNavigate: NavigateHandler;
};

export function ItemForm({ onNavigate }: ItemFormProps) {
  const { user } = useAuth();
  const { submit, loading, error } = useItemForm();
  const [isConfirming, setIsConfirming] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await submit(formData);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-background">
      <Header title="出品" onNavigate={onNavigate} showBack />

      <main className="max-w-3xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 例： */}
          <input
            name="title"
            required
            className="w-full border p-2 rounded"
            placeholder="商品名"
          />

          <textarea
            name="description"
            className="w-full border p-2 rounded"
            placeholder="説明"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent text-white rounded font-bold disabled:opacity-50"
          >
            {loading ? "出品中..." : "出品する"}
          </button>
        </form>
      </main>
    </div>
  );
}
