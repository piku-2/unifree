import { supabase } from "@/lib/supabase/client";

type ItemStatus = "selling" | "reserved" | "sold";

type CreateItemInput = {
  title?: string | null;
  description?: string | null;
  price?: number | string | null;
  category?: string | null;
  status?: ItemStatus | "on_sale" | "sold_out" | "trading" | null;
  images?: string[] | null;
  image_url?: string | null;
};

const normalizeStatus = (status?: CreateItemInput["status"]): ItemStatus => {
  switch (status) {
    case "selling":
    case "reserved":
    case "sold":
      return status;
    case "on_sale":
      return "selling";
    case "trading":
      return "reserved";
    case "sold_out":
      return "sold";
    default:
      return "selling";
  }
};

export const createItem = async (input: CreateItemInput) => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const user = userData.user;
  if (!user) {
    throw new Error("ログインが必要です。/sell から出品してください。");
  }

  const title = (input.title ?? "").trim();
  const description = (input.description ?? "").trim();
  const category = (input.category ?? "").trim();

  if (!title) throw new Error("タイトルは必須です");
  if (!description) throw new Error("説明は必須です");
  if (!category) throw new Error("カテゴリは必須です");

  const priceValue = Number.parseInt(String(input.price ?? ""), 10);
  if (!Number.isFinite(priceValue)) {
    throw new Error("価格は数値で入力してください");
  }
  if (priceValue < 100) {
    throw new Error("最低価格は100円です");
  }

  const imageUrl = input.image_url?.trim() || input.images?.[0]?.trim() || null;

  const status = normalizeStatus(input.status);

  const payload = {
    title,
    description,
    category,
    price: priceValue,
    status,
    image_url: imageUrl,
    owner_id: user.id,
  };

  // ★ Supabase v2 + RLS + strict TS の最終回避策
  const { data, error } = await (supabase.from("items") as any)
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
};
