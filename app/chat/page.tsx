import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServerClient } from "@/lib/supabase/server";

type ChatRoomListItem = {
  id: string;
  item_id: string;
};

export default async function ChatListPage() {
  const supabase = supabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data } = await supabase
    .from("chat_rooms")
    .select("id,item_id")
    .order("created_at", { ascending: false });

  // ★★ ここが「必須」 ★★
  const rooms: ChatRoomListItem[] = (data ?? []) as ChatRoomListItem[];

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">チャット一覧</h1>

      {rooms.length > 0 ? (
        <div className="space-y-2">
          {rooms.map((room) => (
            <Link
              key={room.id}
              href={`/chat/${room.id}`}
              className="block border rounded p-3 hover:shadow"
            >
              <p className="text-sm">Room ID: {room.id}</p>
              <p className="text-xs text-gray-600">Item ID: {room.item_id}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">チャットはまだありません。</p>
      )}
    </main>
  );
}
