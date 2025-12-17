"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { supabaseServerClient } from "@/lib/supabase/server";

export async function createItem(formData: FormData) {
  const supabaseAuth = supabaseServerClient();
  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) throw new Error("認証が必要です。");

  // validate（省略）

  // upload（admin）
  // insert（admin）

  revalidatePath("/");
}
