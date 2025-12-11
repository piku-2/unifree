"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatRoom } from "@/features/chat/components/ChatRoom";

type ChatRoomPageProps = {
  params: { roomId: string };
};

export default function ChatRoomPage({ params }: ChatRoomPageProps) {
  const router = useRouter();
  const roomId = params.roomId;

  return <ChatRoom roomId={roomId} />;
}
