'use client';

import Sidebar, { GroupData } from '@/components/ui/SideBar';
import { User } from '@/utils/userStorage';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { database } from '../../../../firebase';

import { get, onDisconnect, ref, set } from 'firebase/database';
import ChatWindow from '@/components/ui/ChatWindow';

export default function ChatPage() {
  const params = useParams();
  const chatId = params?.chatId as string;

  const [selectedItem, setSelectedItem] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean | null>(null);
  const [grupos, setGrupos] = useState<GroupData | null>(null);


  const configureUser = () => {


    function generateRandomUsername(): string {
      const adjectives = ['Weird', 'Crispy', 'Slippery', 'Funky', 'Rusty', 'Snappy', 'Drippy', 'Wiggly'];
      const nouns = ['Toaster', 'Cabbage', 'Penguin', 'Banana', 'Wormhole', 'Pickle', 'Moose', 'Dolphin'];

      const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

      return randomAdj + randomNoun;
    }


    function getRandomAvatar(username: string): string {
      return `https://api.dicebear.com/7.x/adventurer/png?seed=${username}`;
    }

    const userFromLocalStorage = localStorage.getItem('currentUser');
    let user: User | undefined = userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null;



    if (!user) {
      // Caso o usuário não tenha sido salvo, cria um usuário "Visitante" temporário
      user = {
        id: crypto.randomUUID(),
        username: generateRandomUsername(),
        type: 'Visitante',
        power: 0,
        group: [],
        image: getRandomAvatar(generateRandomUsername()),
        userNameAcess: '',
        password: '',
        status: 'Online',
      };
      // Salva o usuário "Visitante" no localStorage e cookies
      localStorage.setItem('currentUser', JSON.stringify(user));
      document.cookie = `user=${JSON.stringify(user)}; path=/;`;
      setCurrentUser(user);
    } else {
      setCurrentUser(user);
    }
  };

  useEffect(() => {
    if (chatId) {
      const buscarGrupo = async () => {
        const snapshot = await get(ref(database, 'grupos'));
        if (snapshot.exists()) {
          const grupos: Record<string, GroupData> = snapshot.val();
          const grupoEncontrado = Object.entries(grupos).find(([id]) => id.startsWith(chatId!));
          if (grupoEncontrado) {
            const [, grupoData] = grupoEncontrado;
            setGrupos(grupoData);
          }
        }
      };
      buscarGrupo();
    }
    configureUser();
  }, [chatId]);




  const saveUserToFirebase = async (user: User) => {
    const userRef = ref(database, `users/${user.id}`);
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      await set(userRef, user);
    }
  };

  function registerVisitor(groupId: string, user: any, grupo: GroupData) {
    //se existe cadastro no firebase
    const exists = grupos?.members?.hasOwnProperty(user.id) === true;

    if (exists) {
      //Se o tipo for Visitante
      const typeMember = grupos?.members ? Object.values(grupos.members).some(member => member.type === 'Visitante') : false;
      if (typeMember) {
        const UserGroupStatus = ref(database, `grupos/${groupId}/members/${user.id}/status`);
        set(UserGroupStatus, 'Online');
        onDisconnect(UserGroupStatus).set('Offline');
        saveUserToFirebase(user);
      }

      //Outros Tipos Membros, Owner etc a  logica é aqui
      else {

      }
      const userRef = ref(database, `users/${user.id}/status`);
      set(userRef, 'Online');
      onDisconnect(userRef).set('Offline');

    } else {
      //Não encontrou no firebase SALVA como novo usuário
      const userRef = ref(database, `grupos/${groupId}/members/${user.id}`);
      const newUser = { ...currentUser, status: 'Online' };
      set(userRef, newUser);
      saveUserToFirebase(user);
    }
  }



  useEffect(() => {
    if (chatId && currentUser && grupos) {
      registerVisitor(chatId, currentUser, grupos);
    }
  }, [chatId, currentUser, grupos]);


  const handleCookiesAcceptance = () => {
    setCookiesAccepted(true);
    localStorage.setItem('cookiesAccepted', 'true');
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        selectedItem={selectedItem}
        onSelect={setSelectedItem}
        currentUser={{
          id: currentUser?.id ?? '',
          username: currentUser?.username ?? '',
          type: currentUser?.type ?? 'Visitante',
          power: currentUser?.power ?? 0,
          group: currentUser?.group ?? [],
          relacionamento: currentUser?.relacionamento ?? undefined,
          image: currentUser?.image ?? 'default.jpg',
          userNameAcess: currentUser?.userNameAcess ?? 'visitante',
          password: currentUser?.password ?? '',
          status: currentUser?.status ?? 'Offline'
        }}
        groupData={grupos!}
      />

      <div className="flex flex-col flex-1">
        {grupos && <ChatWindow groupData={grupos}
          currentUser={{
            id: currentUser?.id ?? '',
            username: currentUser?.username ?? 'Visitante',
            type: currentUser?.type ?? 'Visitante',
            power: currentUser?.power ?? 0,
            group: currentUser?.group ?? [],
            relacionamento: currentUser?.relacionamento ?? undefined,
            image: currentUser?.image ?? 'default.jpg',
            userNameAcess: currentUser?.userNameAcess ?? 'visitante',
            password: currentUser?.password ?? '',
            status: currentUser?.status ?? 'Offline'
          }} />}
      </div>
      {/* {!cookiesAccepted && <CookieConsent onAccept={handleCookiesAcceptance} />} */}


    </div>
  )
}
