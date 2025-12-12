"use server";

import { supabaseServerClient } from "@/lib/supabase/server";

/**
 * items テーブル（最小取得）
 */
type ItemRow = {
  id: number;
  owner_id: string;
};

/**
 * chat_rooms 取得用
 */
type ChatRoomRow = {
  id: number;
  buyer_id: string;
  seller_id: string;
};

/**
 * chat_rooms insert 用
 */
type ChatRoomInsert = {
  item_id: number;
  buyer_id: string;
  seller_id: string;
};

/**
 * messages insert 用
 */
type MessageInsert = {
  room_id: number;
  sender_id: string;
  content: string;
};

/**
 * チャット開始（既存があれば再利用）
 */
export async function startChat(itemId: number | string) {
  const supabase = supabaseServerClient();

  // 認証確認
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("認証が必要です。");

  // 商品取得
  const { data: item, error: itemError } = await supabase
    .from("items")
    .select("id, owner_id")
    .eq("id", itemId)
    .single<ItemRow>();

  if (itemError) throw itemError;
  if (!item) throw new Error("商品が見つかりません。");

  const buyerId = user.id;
  const sellerId = item.owner_id;

  if (buyerId === sellerId) {
    throw new Error("自身の出品にはチャットできません。");
  }

  // 既存チャット確認
  const { data: existing } = await supabase
    .from("chat_rooms")
    .select("id")
    .eq("item_id", item.id)
    .eq("buyer_id", buyerId)
    .eq("seller_id", sellerId)
    .maybeSingle<{ id: number }>();

  if (existing?.id) {
    return existing.id;
  }

  // 新規チャット作成（Supabase v2 型地獄のため insert は any で回避）
  const payload: ChatRoomInsert = {
    item_id: item.id,
    buyer_id: buyerId,
    seller_id: sellerId,
  };

  const { data: created, error: createError } = await supabase
    .from("chat_rooms")
    .insert([payload] as any)
    .select("id")
    .single<{ id: number }>();

  if (createError) throw createError;
  if (!created) throw new Error("チャット作成に失敗しました。");

  return created.id;
}

/**
 * メッセージ送信
 */
export async function sendMessage(roomId: number | string, content: string) {
  const supabase = supabaseServerClient();

  // 認証確認
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("認証が必要です。");

  // チャットルーム取得
  const { data: room, error: roomError } = await supabase
    .from("chat_rooms")
    .select("id, buyer_id, seller_id")
    .eq("id", roomId)
    .single<ChatRoomRow>();

  if (roomError) throw roomError;
  if (!room) throw new Error("チャットルームが見つかりません。");

  // 当事者チェック
  if (room.buyer_id !== user.id && room.seller_id !== user.id) {
    throw new Error("このチャットに参加していません。");
  }

  // メッセージ送信
  const messagePayload: MessageInsert = {
    room_id: room.id,
    sender_id: user.id,
    content,
  };

  const { error } = await supabase
    .from("messages")
    .insert([messagePayload] as any);

  if (error) throw error;
}
