'use client'

import { useState } from 'react';
import Sidebar from '../../components/ui/SideBar';
import ChatWindow from '../../components/ui/ChatWindow';
import MessageInput from '../../components/ui/MessageInput';
import DirectChat from '@/components/ui/DirectChat';

export default function ChatPage() {
  const [selectedItem, setSelectedItem] = useState<'direct' | string>('direct');
  const [isTyping, setIsTyping] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar selectedItem={selectedItem} onSelect={setSelectedItem} />
      {selectedItem === 'direct' ? (
        <>
          <DirectChat isTyping={isTyping} />

        </>
      ) : (
        <>
          <div className="flex flex-col flex-1">
            <ChatWindow isTyping={isTyping} groupName={selectedItem} />
            <MessageInput setIsTyping={setIsTyping} />
          </div>
        </>
      )}



    </div>
  );
}
