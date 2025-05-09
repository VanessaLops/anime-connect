'use client';
import { useEffect, useState } from 'react';
import Sidebar, { GroupData } from '../../components/ui/SideBar';
import ChatWindow from '../../components/ui/ChatWindow';
import { useSearchParams } from 'next/navigation';
import { database } from '../../../firebase';
import { ref, get, set, onDisconnect } from 'firebase/database';
import { User } from '@/utils/userStorage';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const groupId = searchParams.get('group');
  const [selectedItem, setSelectedItem] = useState('Ajuda');
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cookiesAccepted, setCookiesAccepted] = useState<boolean | null>(null);
  const [grupos, setGrupos] = useState<GroupData | null>(null);

  const configureUser = () => {

    const userFromLocalStorage = localStorage.getItem('currentUser');
    let user: User | null = userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null;

    if (!user) {
      // Caso o usuário não tenha sido salvo, cria um usuário "Visitante" temporário
      user = {
        id: crypto.randomUUID(),
        username: '',
        type: 'Visitante',
        power: 0,
        group: [],
        image: 'default.jpg',
        userNameAcess: '',
        password: '',
        status: 'online',
      };
      // Salva o usuário "Visitante" no localStorage e cookies
      localStorage.setItem('currentUser', JSON.stringify(user));
      document.cookie = `user=${JSON.stringify(user)}; path=/;`;
      setCurrentUser(user);
      saveUserToFirebase(user);
    } else {
      setCurrentUser(user);
    }
  };

  const saveUserToFirebase = async (user: User) => {
    const userRef = ref(database, `users/${user.id}`);
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      await set(userRef, user);
    }
  };

  function registerVisitor(groupId: string, user: any, grupo: GroupData) {
    //Verifica se está no firebase

    const exists = grupos?.members?.hasOwnProperty(user.id) === true;

    if (exists) {
      //Se o tipo for Visitante
      const typeMember = grupos?.members ? Object.values(grupos.members).some(member => member.type === 'Visitante') : false;
      if (typeMember) {
        const userStatusRef = ref(database, `grupos/${groupId}/members/${user.id}/status`);
        set(userStatusRef, 'Online');
        onDisconnect(userStatusRef).set('Offline');
      }
      //Outros Tipos Membros, Owner etc a  logica é aqui
      else {

      }
    } else {
      //Não encontrou no firebase SALVA como novo usuário
      const userRef = ref(database, `grupos/${groupId}/members/${user.id}`);
      const newUser = { ...currentUser, status: 'Online' };
      set(userRef, newUser);
    }
  }



  useEffect(() => {
    if (groupId) {
      const buscarGrupo = async () => {
        const snapshot = await get(ref(database, 'grupos'));
        if (snapshot.exists()) {
          const grupos: Record<string, GroupData> = snapshot.val();
          const grupoEncontrado = Object.entries(grupos).find(([id]) => id.startsWith(groupId!));
          if (grupoEncontrado) {
            const [, grupoData] = grupoEncontrado;
            setGrupos(grupoData);
          }
        }
      };
      buscarGrupo();
    }
    configureUser();
  }, [groupId]);


  const handleCookiesAcceptance = () => {
    setCookiesAccepted(true);
    localStorage.setItem('cookiesAccepted', 'true');
  };

  useEffect(() => {
    if (groupId && currentUser && grupos) {
      registerVisitor(groupId, currentUser, grupos);
    }
  }, [groupId, currentUser, grupos]);

  const gruposArray = grupos ? Object.values(grupos) : [];

  return (
    <div className="flex h-screen">
      <Sidebar
        selectedItem={selectedItem}
        onSelect={setSelectedItem}
        currentUser={{
          id: currentUser?.id ?? '',
          type: currentUser?.type ?? 'Visitante',
        }}
        groupData={grupos!}
      />

      <div className="flex flex-col flex-1">
        {grupos && <ChatWindow groupData={grupos}
          currentUser={{
            id: currentUser?.id ?? '',
            type: currentUser?.type ?? 'Visitante',
            status: currentUser?.status ?? ''
          }} />}
      </div>
      {/* {!cookiesAccepted && <CookieConsent onAccept={handleCookiesAcceptance} />} */}
    </div>
  );
}
