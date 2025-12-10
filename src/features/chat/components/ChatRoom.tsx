import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/Header';
import { useChat } from '../hooks/useChat';
import { useAuth } from '@/features/user/hooks/useAuth';
import { NavigateHandler } from '@/config/navigation';

type ChatRoomProps = {
  roomId: string;
  onNavigate: NavigateHandler;
};

export function ChatRoom({ roomId, onNavigate }: ChatRoomProps) {
  const { user } = useAuth();
  const { messages, loading, send } = useChat(roomId, user?.id || '');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    await send(inputText);
    setInputText('');
  };

  if(!user) return <div>Auth required</div>;

  return (
    <div className="flex flex-col h-screen bg-background pb-20 md:pb-0">
      <Header title="チャット" onNavigate={onNavigate} showBack />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && <div className="text-center">Loading...</div>}

        {messages.map((msg) => {
          const isMe = msg.sender_id === user.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-lg ${
                isMe ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card border border-border rounded-bl-none'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-primary-foreground/70' : 'text-secondary'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && handleSend()}
            placeholder="メッセージを入力..."
            className="flex-1 p-3 border border-border rounded bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="px-4 bg-primary text-primary-foreground rounded disabled:opacity-50"
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
}
