"use server";

import { supabaseServerClient } from "@/lib/supabase/server";

export async function getItem(id: string) {
  const supabase = supabaseServerClient();

  const { data, error } = await supabase
    .from("items")
    .select(
      `
      id,
      title,
      description,
      category,
      price,
      images,
      user_id,
      owner:profiles (
        id,
        username,
        avatar_url
      )
    `
    )
    .eq("id", id)
    .single<any>();

  if (error) {
    console.error("getItem error:", error);
    return null;
  }

  return data;
}
