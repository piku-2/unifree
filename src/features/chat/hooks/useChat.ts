import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/libs/supabase/client';
import { Message } from '../types';
import { getMessages } from '../api/getMessages';
import { sendMessage } from '../api/sendMessage';

export function useChat(roomId: string, userId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomId) return;

    // Initial load
    getMessages(roomId).then(data => {
      setMessages(data);
      setLoading(false);
    });

    // Real-time subscription
    const channel = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const send = async (content: string) => {
    await sendMessage(roomId, userId, content);
  };

  return { messages, loading, send };
}
