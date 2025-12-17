"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServerClient } from "@/lib/supabase/server";

export async function createItem(formData: FormData) {
  // 🔒 認証確認は cookie client
  const supabaseAuth = supabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabaseAuth.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("認証が必要です。");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const condition = String(formData.get("condition") ?? "").trim();
  const price = Number(formData.get("price"));

  if (!title || !description || !category || !condition || !price) {
    throw new Error("必須項目が不足しています。");
  }

  // ✅ 空の File（size=0）を除外する
  const files = (formData.getAll("images") as File[]).filter(
    (file) => file.size > 0
  );

  if (files.length === 0 || files.length > 3) {
    throw new Error("商品画像は1〜3枚指定してください。");
  }

  const imageUrls: string[] = [];

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      throw new Error("画像ファイルのみアップロードできます。");
    }

    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("items")
      .upload(path, file);

    if (uploadError) throw uploadError;

    const { data } = supabaseAdmin.storage.from("items").getPublicUrl(path);

    imageUrls.push(data.publicUrl);
  }

  // ✅ insert は service role
  const { error: insertError } = await supabaseAdmin.from("items").insert({
    user_id: user.id,
    title,
    description,
    category,
    condition,
    price,
    images: imageUrls,
    status: "on_sale",
  });

  if (insertError) throw insertError;

  revalidatePath("/");
}
