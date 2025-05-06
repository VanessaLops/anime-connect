'use client'


import ChatWindow from "@/components/ui/ChatWindow";
import DirectChat from "@/components/ui/DirectChat";
import MessageInput from "@/components/ui/MessageInput";
import Sidebar from "@/components/ui/SideBar";
import { getUserFromLocalStorage, saveUserAsVisitor, User } from "@/utils/userStorage";
import {useEffect, useState } from "react";




export default function ChatPage() {
  const [selectedItem, setSelectedItem] = useState<'direct' | string>('direct');
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const initUser = async () => {
      const user = getUserFromLocalStorage();
  
      if (!user) {
        const visitante = await saveUserAsVisitor(); 
        setCurrentUser(visitante);
      } else {
        setCurrentUser(user);
      }
    };
  
    initUser();
  }, []);
  

  useEffect(() => {
    if (selectedItem === 'direct') {
      document.title = 'Chat Direto';
      history.replaceState(null, '', '/chat');
    } else {
      document.title = `#${selectedItem}`;
      history.replaceState(null, '', `/chat#${encodeURIComponent(selectedItem)}`);
    }
  }, [selectedItem]);

  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.replace('#', ''));
    if (hash) {
      setSelectedItem(hash);
    }
  }, []);

  if (!currentUser) return <div>Carregando usuário...</div>;

  return (
    <div className="flex h-screen">
      <Sidebar selectedItem={selectedItem} onSelect={setSelectedItem} currentUser={currentUser} />
      {selectedItem === 'direct' ? (
        <DirectChat isTyping={isTyping} usersData={currentUser} />
      ) : (
        <div className="flex flex-col flex-1">
          {/* <ChatWindow isTyping={isTyping} groupName={selectedItem} currentUser={currentUser} />
          <MessageInput setIsTyping={setIsTyping} currentUser={currentUser} /> */}
        </div>
      )}
    </div>
  );
}
