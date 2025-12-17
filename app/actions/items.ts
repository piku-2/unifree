"use server";

import { revalidatePath } from "next/cache";
import { supabaseServerClient } from "../../lib/supabase/server";
import { Database } from "../../supabase/types";

type ItemFilters = {
  category?: string;
};

export type ItemWithOwner = Database["public"]["Tables"]["items"]["Row"] & {
  owner?: Pick<
    Database["public"]["Tables"]["profiles"]["Row"],
    "id" | "username" | "avatar_url"
  > | null;
};

// ---------------------------------------------------------
// Create Item（3枚画像対応）
// ---------------------------------------------------------
export async function createItem(formData: FormData) {
  const supabase = supabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("認証が必要です。");

  // -------------------------
  // Text fields
  // -------------------------
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const price = Number(formData.get("price"));

  if (!title || !description || !category || !Number.isFinite(price)) {
    throw new Error("必須項目が不足しています。");
  }

  // -------------------------
  // Images（1〜3枚）
  // -------------------------
  const files = formData.getAll("images") as File[];

  if (files.length === 0 || files.length > 3) {
    throw new Error("商品画像は1〜3枚指定してください。");
  }

  const imageUrls: string[] = [];

  for (const file of files) {
    if (!(file instanceof File)) continue;
    if (!file.type.startsWith("image/")) {
      throw new Error("画像ファイルのみアップロードできます。");
    }

    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("items")
      .upload(path, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("items").getPublicUrl(path);
    imageUrls.push(data.publicUrl);
  }

  // -------------------------
  // Insert DB
  // -------------------------
  const { error } = await supabase.from("items").insert({
    owner_id: user.id,
    title,
    description,
    category,
    price,
    image_url: imageUrls[0] ?? null,
    image_url_2: imageUrls[1] ?? null,
    image_url_3: imageUrls[2] ?? null,
    status: "selling",
  } as any);

  if (error) throw error;

  revalidatePath("/");
}
// ---------------------------------------------------------
// Read helpers
// ---------------------------------------------------------
export async function getItems(filters: ItemFilters = {}) {
  const supabase = supabaseServerClient();

  let query = supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getItem(
  id: number | string
): Promise<ItemWithOwner | null> {
  const supabase = supabaseServerClient();

  const { data, error } = await supabase
    .from("items")
    .select(
      `
        *,
        owner:profiles!items_owner_id_fkey (
          id,
          username,
          avatar_url
        )
      `
    )
    .eq("id", String(id))
    .maybeSingle<ItemWithOwner>();

  if (error) throw error;
  return data ?? null;
}
