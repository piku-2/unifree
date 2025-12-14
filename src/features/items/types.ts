// src/features/items/types.ts

export type ItemStatus = "selling" | "reserved" | "sold";

export type Item = {
  id: string;
  title: string;
  description?: string | null;
  price: number;

  /** カテゴリ（Home.tsx で使用） */
  category?: string | null;

  /** 代表画像（Home / ItemCard で使用） */
  image_url?: string | null;

  /** 管理・表示に必要 */
  status: ItemStatus;

  /** 所有者 */
  owner_id: string;

  created_at: string;
};

export type ItemWithUser = Item & {
  user?: {
    id: string;
    name?: string;
    username?: string | null;
    avatar_url?: string | null;
  };
};

export type CreateItemInput = {
  title: string;
  description?: string;
  price: number;
  category?: string;
  condition?: string;
};
