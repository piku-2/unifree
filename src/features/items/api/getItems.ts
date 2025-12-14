import { supabase } from "@/lib/supabase/client";
import { Item, ItemWithUser } from "../types";

export const getItems = async (): Promise<ItemWithUser[]> => {
  // セッション確認（デバッグ用）
  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log("SESSION_CHECK:", session);

  type ItemRow = Item & {
    owner?: {
      id: string;
    };
  };

  const { data, error } = await supabase
    .from("items")
    .select(
      `
      *,
      owner:users!items_user_id_fkey (
        id
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getItems error:", error);
    throw error;
  }

  return (
    (data as ItemRow[] | null)?.map(({ owner, ...rest }) => ({
      ...rest,
      user: owner
        ? {
            id: owner.id,
          }
        : undefined,
    })) ?? []
  );
};
