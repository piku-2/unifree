export default function ChatRoomPage({ params }: { params: { roomId: string } }) {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Chat Room (placeholder)</h1>
      <p>Room ID: {params.roomId}</p>
      <p>当事者のみアクセスできるチャット UI を実装予定です。</p>
    </main>
  );
}
