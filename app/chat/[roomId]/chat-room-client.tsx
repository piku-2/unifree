'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { sendMessage } from '@/app/actions/chat/send-message';

type Message = {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
};

type ChatRoomClientProps = {
  roomId: string;
  userId: string;
  messages: Message[];
};

export function ChatRoomClient({ roomId, userId, messages }: ChatRoomClientProps) {
  const router = useRouter();
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = text.trim();
    if (!value) {
      setError('メッセージを入力してください');
      return;
    }
    setError('');
    startTransition(async () => {
      const res = await sendMessage(roomId, value);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setText('');
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-lg bg-card p-4 space-y-3 max-h-[60vh] overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-secondary text-sm">まだメッセージはありません。</p>
        ) : (
          messages.map((message) => {
            const isMe = message.sender_id === userId;
            return (
              <div
                key={message.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    isMe ? 'bg-primary text-white' : 'bg-muted text-foreground'
                  }`}
                >
                  <p>{message.content}</p>
                  <span className="block mt-1 text-[10px] opacity-75">
                    {new Date(message.created_at).toLocaleString('ja-JP')}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          name="message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border border-border rounded-lg px-3 py-2 bg-card"
          placeholder="メッセージを入力"
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#5A8BFF] transition-colors disabled:opacity-70"
        >
          {isPending ? '送信中...' : '送信'}
        </button>
      </form>

      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
