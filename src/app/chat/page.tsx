'use client';

import { useEffect, useState } from 'react';
import Sidebar from '../../components/ui/SideBar';
import ChatWindow from '../../components/ui/ChatWindow';
import { saveUserAsVisitor, User } from '@/utils/userStorage';
import CookieConsent from '@/components/ui/CookieConsent';

export default function ChatPage() {
  
  const [selectedItem, setSelectedItem] = useState<'direct' | string>('direct');
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean | null>(null); // Inicializa como null

  useEffect(() => {
    // Carregar o visitante
    const loadVisitor = async () => {
      try {
        const user = await saveUserAsVisitor();
        setCurrentUser(user);
      } catch (error) {
        console.error("Erro ao carregar o visitante:", error);
      }
    };

    loadVisitor();
    const accepted = localStorage.getItem('cookiesAccepted');
    if (accepted === 'true') {
      setCookiesAccepted(true);
    } else {
      setCookiesAccepted(false); 
    }
  }, []);

  const handleCookiesAcceptance = () => {
    setCookiesAccepted(true);

    localStorage.setItem('cookiesAccepted', 'true');
  };

  
  if (cookiesAccepted === null) {
    return null; 
  }

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

      <div className="flex flex-col flex-1">
        <ChatWindow
          isTyping={isTyping}
          setIsTyping={setIsTyping}
          groupName={selectedItem}
          currentUser={{
            id: currentUser?.id ?? '',
            type: currentUser?.type ?? 'Visitante',
            image: currentUser?.image ?? '',
            username: currentUser?.username ?? ''
          }}
          isChatEnabled={cookiesAccepted}
        />
      </div>
      {!cookiesAccepted && <CookieConsent onAccept={handleCookiesAcceptance} />}
    </div>
  );
}
