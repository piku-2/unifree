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

// display:none/hidden ではなく「フォーカス可能な不可視化」
const visuallyHiddenStyle: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: 0,
};

export function SellForm({ onSubmit }: SellFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[]>([]);

  const openPicker = () => {
    fileInputRef.current?.click();
  };

  const onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const merged = [...images, ...files].slice(0, 3);
    setImages(merged);
    e.target.value = "";
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

            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="relative aspect-square border-2 rounded border-border flex items-center justify-center overflow-hidden"
                >
                  {images[i] ? (
                    <>
                      <img
                        src={URL.createObjectURL(images[i])}
                        alt=""
                        className="w-full h-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setImages(images.filter((_, index) => index !== i))
                        }
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={openPicker}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <span className="text-2xl">+</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* hidden input（実体は1つ） */}
            <input
              ref={fileInputRef}
              type="file"
              name="images"
              accept="image/*"
              multiple
              className="hidden"
              onChange={onFilesChange}
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
          <div className="grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <label key={c} className="cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={c}
                  className="peer"
                  style={visuallyHiddenStyle}
                  required
                />
                <div className="p-3 border rounded text-center peer-checked:bg-primary peer-checked:text-white">
                  {c}
                </div>
              </label>
            ))}
          </div>

          {/* Price */}
          <input
            name="price"
            type="number"
            required
            placeholder="価格"
            className="w-full p-3 border rounded"
          />

          {/* Condition */}
          <div className="grid grid-cols-3 gap-2">
            {conditions.map((c) => (
              <label key={c} className="cursor-pointer">
                <input
                  type="radio"
                  name="condition"
                  value={c}
                  className="peer"
                  style={visuallyHiddenStyle}
                  required
                />
                <div className="p-3 border rounded text-center peer-checked:bg-primary peer-checked:text-white">
                  {c}
                </div>
              </label>
            ))}
          </div>

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
