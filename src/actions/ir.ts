// ❌ 削除
// import { supabaseServerClient } from "@/libs/supabase/server";

// ✅ これに変更
import { supabase } from "@/libs/supabase/client";
import type { Database } from "@/libs/supabase/types";

type Item = Database["public"]["Tables"]["items"]["Row"];

export async function getItem(id: string): Promise<Item | null> {
  const { data, error } = await supabase
    .from("items")
    .select("id,title,description,category,condition,price,images,user_id")
    .eq("id", id)
    .limit(1)
    .maybeSingle<Item>();

  if (error || !data) return null;
  return data;
}
