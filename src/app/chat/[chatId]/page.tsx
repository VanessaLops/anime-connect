'use client';

import { useParams } from 'next/navigation';

export default function ChatPage() {
  const params = useParams();
  const chatId = params?.chatId as string;

  return  (
    <div>
      <h1> oi {chatId} </h1>
    </div>
  )
}
