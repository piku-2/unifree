// app/actions/items.ts
import { supabaseServerClient } from "@/lib/supabase/server";

export async function getItem(id: string) {
  const supabase = supabaseServerClient();

  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getItem error:", error);
    throw new Error("Failed to fetch item");
  }

  return data;
}
