"use client";

import { useState } from "react";
import { Header } from "./Header";

type SellFormProps = {
  onSubmit: (formData: FormData) => Promise<void>;
};

const events = [
  { id: "1", name: "春学期フリマ 2025 (4/15)" },
  { id: "2", name: "卒業生応援フリマ (3/25)" },
];

const categories = ["家電", "家具", "本", "生活雑貨", "その他"];
const conditions = ["新品", "美品", "使用感あり"];

export function SellForm({ onSubmit }: SellFormProps) {
  const [formData, setFormData] = useState({
    event: "",
    title: "",
    category: "",
    price: "",
    condition: "",
    description: "",
    deliveryMethod: "手渡し",
  });

  const [uploadedImages, setUploadedImages] = useState<number>(0);

  return (
    <div className="min-h-screen pb-20 md:pb-8 bg-background">
      <Header title="出品する" showBack />

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="border border-border bg-card p-6 rounded-lg shadow-sm">
          <h2 className="text-xl mb-6 text-primary">新規出品</h2>

          {/* 🔴 Server Action を直接呼ぶ */}
          <form action={onSubmit} className="space-y-6">
            {/* Event */}
            <div>
              <label className="block text-sm mb-2">
                イベント選択 <span className="text-destructive">*</span>
              </label>
              <select
                name="event"
                required
                value={formData.event}
                onChange={(e) =>
                  setFormData({ ...formData, event: e.target.value })
                }
                className="w-full p-3 border rounded"
              >
                <option value="">イベントを選択</option>
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Images (UIのみ / MVP) */}
            <div>
              <label className="block text-sm mb-2">
                商品画像（1〜3枚） <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setUploadedImages(i)}
                    className={`aspect-square border-2 rounded ${
                      i <= uploadedImages ? "border-primary" : "border-border"
                    }`}
                  >
                    {i <= uploadedImages ? "✓" : "+"}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <input
              name="title"
              required
              placeholder="タイトル"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-3 border rounded"
            />

            {/* Category */}
            <div className="grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: c })}
                  className={`p-3 border rounded ${
                    formData.category === c ? "bg-primary text-white" : ""
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Price */}
            <input
              name="price"
              type="number"
              required
              placeholder="価格"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full p-3 border rounded"
            />

            {/* Condition */}
            <div className="grid grid-cols-3 gap-2">
              {conditions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({ ...formData, condition: c })}
                  className={`p-3 border rounded ${
                    formData.condition === c ? "bg-primary text-white" : ""
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Description */}
            <textarea
              name="description"
              required
              rows={5}
              placeholder="説明"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-3 border rounded"
            />

            <button
              type="submit"
              className="w-full py-3 bg-accent text-white rounded"
            >
              出品する
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
