"use client";

import React, { useRef, useState } from "react";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[]>([]);

  const openPicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 pt-24">
      <div className="border border-border bg-card p-6 rounded-lg shadow-sm">
        <h2 className="text-xl mb-6 text-primary">新規出品</h2>

        <form action={onSubmit} className="space-y-6">
          {/* Event */}
          <div>
            <label className="block text-sm mb-2">
              イベント選択 <span className="text-destructive">*</span>
            </label>
            <select name="event" required className="w-full p-3 border rounded">
              <option value="">イベントを選択</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          {/* 商品画像 */}
          <div>
            <label className="block text-sm mb-2">
              商品画像（1〜3枚） <span className="text-destructive">*</span>
            </label>

            <div className="grid grid-cols-3 gap-4 mb-2">
              {images.map((file, i) => (
                <div
                  key={i}
                  className="relative aspect-square border-2 rounded border-border overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

              {images.length === 0 && (
                <button
                  type="button"
                  onClick={openPicker}
                  className="aspect-square border-2 border-dashed rounded flex items-center justify-center text-muted-foreground"
                >
                  画像を選択
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              name="images"
              accept="image/*"
              multiple
              required
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []).slice(0, 3);
                setImages(files);
              }}
            />
          </div>

          {/* Title */}
          <input
            name="title"
            required
            placeholder="タイトル"
            className="w-full p-3 border rounded"
          />

          {/* Category */}
          <fieldset className="space-y-2">
            <legend className="text-sm">
              カテゴリ <span className="text-destructive">*</span>
            </legend>

            <div className="space-y-2">
              {categories.map((c) => (
                <label
                  key={c}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input type="radio" name="category" value={c} required />
                  <span>{c}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Price */}
          <input
            name="price"
            type="number"
            required
            placeholder="価格"
            className="w-full p-3 border rounded"
          />

          {/* Condition */}
          <fieldset className="space-y-2">
            <legend className="text-sm">
              商品状態 <span className="text-destructive">*</span>
            </legend>

            <div className="space-y-2">
              {conditions.map((c) => (
                <label
                  key={c}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input type="radio" name="condition" value={c} required />
                  <span>{c}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Description */}
          <textarea
            name="description"
            required
            rows={5}
            placeholder="説明"
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
  );
}
