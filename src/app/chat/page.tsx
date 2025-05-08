'use client'

import { useEffect, useState } from 'react';
import Sidebar from '../../components/ui/SideBar';
import ChatWindow from '../../components/ui/ChatWindow';
import { saveUserAsVisitor, User } from '@/utils/userStorage';

export default function ChatPage() {
  const [selectedItem, setSelectedItem] = useState<'direct' | string>('direct');
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);


  useEffect(() => {
    const loadVisitor = async () => {
      try {
        const user = await saveUserAsVisitor();
        setCurrentUser(user);
      } catch (error) {
        console.error("Erro ao carregar o visitante:", error);
      }
    };

    loadVisitor();
  }, []);

  console.log(currentUser, 'currentUsercurrentUser')

  return (
    <div className="flex h-screen">
      <Sidebar
        selectedItem={selectedItem}
        onSelect={setSelectedItem}
        currentUser={{
          id: currentUser?.id ?? '',
          type: currentUser?.type ?? 'Visitante'
        }}
      />

      {selectedItem === 'direct' ? (
        <>
          {/* Aqui você pode adicionar o componente de chat direto, caso necessário */}
          <h1>DESATIVADO</h1>
        </>
      ) : (
        <div className="flex flex-col flex-1">
          <ChatWindow isTyping={isTyping} setIsTyping={setIsTyping} groupName={selectedItem}
            currentUser={{
              id: currentUser?.id ?? '',
              type: currentUser?.type ?? 'Visitante',
              image: currentUser?.image ?? '',
              username: currentUser?.username ?? ''
            }}
          />
        </div>
      )}
    </div>
  );
}
