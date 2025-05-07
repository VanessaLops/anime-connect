
'use client'

import { useEffect, useState } from 'react';
import Sidebar from '../../components/ui/SideBar';
import ChatWindow from '../../components/ui/ChatWindow';
import MessageInput from '../../components/ui/MessageInput';
import { getUserFromLocalStorage, saveUserAsVisitor, User } from '@/utils/userStorage';

export default function ChatPage() {
  const [selectedItem, setSelectedItem] = useState<'direct' | string>('direct');
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>();

  console.log(currentUser)
  useEffect(() => {
    const initUser = async () => {
      const user = getUserFromLocalStorage();
      if (!user) {
        const visitante = await saveUserAsVisitor();
        setCurrentUser(visitante);
      } else {
        setCurrentUser(user);
      }


      //COMENTANDO POR ENQUANTO NAO TEM TABELA AMIGOS
      // const amigosSalvos = JSON.parse(localStorage.getItem('friends') || '[]');
      // setFriends(amigosSalvos);


      // if (amigosSalvos.length > 0) {
      //   setSelectedItem('direct');
      // } else {
      //   setSelectedItem('geral');
      // }
    };

    initUser();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar selectedItem={selectedItem} onSelect={setSelectedItem} />
      {selectedItem === 'direct' ? (
        <>
         {/* <DirectChat isTyping={isTyping} usersData={[currentUser]}/> */}
          <h1>DESATIVADO</h1>
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