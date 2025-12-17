import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { startChat } from "@/actions/chat";
import { getItem } from "@/actions/ir";
import { supabaseServerClient } from "@/lib/supabase/server";

// UUID v4 判定
function isValidUUID(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    id
  );
}

export default async function ItemDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const itemId = params.id;

  if (!isValidUUID(itemId)) {
    notFound();
  }

  const item = await getItem(itemId);
  if (!item) {
    notFound();
  }

  // 🔒 型確定（ここで初めて安全）
  const safeItem = item;

  const supabase = supabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  async function handleStartChat() {
    "use server";
    const roomId = await startChat(itemId);
    revalidatePath(`/chat/${roomId}`);
    redirect(`/chat/${roomId}`);
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{safeItem.title}</h1>
      <p className="text-gray-600">{safeItem.category}</p>
      <p className="text-xl text-blue-600">
        ¥{safeItem.price.toLocaleString()}
      </p>
      <p>{safeItem.description}</p>

      {Array.isArray(safeItem.images) && safeItem.images.length > 0 && (
        <img
          src={safeItem.images[0]}
          alt={safeItem.title}
          className="max-w-md"
        />
      )}

      <form action={handleStartChat} className="space-y-2">
        <button
          type="submit"
          className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-60"
          disabled={!user || user.id === safeItem.user_id}
        >
          チャットを開始
        </button>

        {!user && (
          <p className="text-sm text-gray-600">
            ログインしてチャットを開始できます。
          </p>
        )}

        {user?.id === safeItem.user_id && (
          <p className="text-sm text-gray-600">
            自分の出品にはチャットできません。
          </p>
        )}
      </form>
    </main>
  );
}
