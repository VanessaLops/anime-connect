import { database } from "../../firebase";
import { ref, set, get, onDisconnect } from "firebase/database";

export type UserType =
  | "Dono_Geral"
  | "Admin_mod"
  | "Dono_Sala"
  | "Staff"
  | "Membro"
  | "Visitante";

export interface User {
  id: string;
  username: string;
  type: UserType;
  power: number;
  group: string[];
  relacionamento?: string;
  image: string;
  userNameAcess: string;
  password: string;
  status?: string;
}

const AJUDA_GROUP_ID = "c5456b27-a0cd-4191-aa25-9014898359b8";

const generateUsername = () => {
  const animeNames = ["Naruto", "Sasuke", "Goku", "Luffy", "Saitama", "Hinata", "Kakashi", "Mikasa", "Yuno", "Light"];
  const randomName1 = animeNames[Math.floor(Math.random() * animeNames.length)];
  const randomName2 = animeNames[Math.floor(Math.random() * animeNames.length)];
  const randomNumber = Math.floor(Math.random() * 100000);
  return `${randomName1}${randomName2}${randomNumber}`;
};



const generateAvatar = () => {
  return `https://api.dicebear.com/6.x/croodles-neutral/svg?seed=${Math.floor(Math.random() * 100000)}`;
};



export const getUserIP = async (): Promise<string | null> => {
  try {
    const r = await fetch("https://api.ipify.org?format=json");
    const data = await r.json();
    console.log(">> getUserIP retornou:", data.ip);
    return data.ip;
  } catch (error) {
    console.error("Erro ao obter IP:", error);
    return null;
  }
};


const isMobileDevice = (): boolean => {
  const mobile = /Mobi|Android/i.test(navigator.userAgent);
  console.log(">> isMobileDevice:", mobile);
  return mobile;
};


function getVisitorIdFromCookie(): string | null {
  const match = document.cookie.match(/(^| )visitor_id=([^;]+)/);
  return match ? match[2] : null;
}
// ... (código existente acima mantido)

export const saveUserAsVisitor = async (): Promise<User> => {
  const cookieVisitorId = getVisitorIdFromCookie();
  const localVisitorId = localStorage.getItem('visitor_id');

  if (!cookieVisitorId && !localVisitorId) {
    console.log('Primeira visita detectada. Limpando cookies antigos...');
    document.cookie
      .split(";")
      .forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
  }

  if (cookieVisitorId) {
    const snapshot = await get(ref(database, `visitors/${cookieVisitorId}`));
    if (snapshot.exists()) {
      const existingUser = snapshot.val();
      const isAlreadyInGroup = existingUser.group.includes(AJUDA_GROUP_ID);
      const isOnline = existingUser.status === 'online';

      if (isAlreadyInGroup && isOnline) {
        console.log("Visitante já está no grupo e online. Nada a alterar.");
        return existingUser;
      }

      const userStatusRef = ref(database, `visitors/${cookieVisitorId}/status`);
      await set(userStatusRef, 'online');
      onDisconnect(userStatusRef).set('offline');

      if (!isAlreadyInGroup) {
        const groupMemberRef = ref(database, `grupos/${AJUDA_GROUP_ID}/members/${cookieVisitorId}`);
        await set(groupMemberRef, { status: 'online' });
      }

      return existingUser;
    }
  }

  const ip = await getUserIP();
  const device = isMobileDevice() ? "mobile" : "desktop";
  const uuid = crypto.randomUUID();
  const username = generateUsername();
  const avatar = generateAvatar();

  const visitante: User = {
    id: uuid,
    username,
    type: "Visitante",
    power: 0,
    group: [AJUDA_GROUP_ID],
    relacionamento: "",
    image: avatar,
    userNameAcess: '',
    password: ''
  };

  console.log("Usuário visitante:", visitante);

  await set(ref(database, `visitors/${uuid}`), {
    ...visitante,
    ip: ip ?? "unknown",
    device,
    timestamp: new Date().toISOString(),
    status: 'online'
  });

  document.cookie = `visitor_id=${uuid}; path=/; max-age=86400`;
  localStorage.setItem('visitor_id', uuid);

  const groupMemberRef = ref(database, `grupos/${AJUDA_GROUP_ID}/members/${uuid}`);
  await set(groupMemberRef, { status: 'online' });
  onDisconnect(groupMemberRef).set({ id: uuid, status: 'offline' });
  onDisconnect(groupMemberRef).remove();

  return visitante;
};

// ✅ NOVA FUNÇÃO PARA SALVAR MEMBRO
export const saveUserAsMember = async (user: User): Promise<void> => {
  const ip = await getUserIP();
  const device = isMobileDevice() ? "mobile" : "desktop";

  const updatedUser = {
    ...user,
    ip: ip ?? "unknown",
    device,
    timestamp: new Date().toISOString(),
    status: 'online',
  };

  const userRef = ref(database, `members/${user.id}`);
  const statusRef = ref(database, `members/${user.id}/status`);

  // ⚠️ onDisconnect precisa ser vinculado ao statusRef enquanto a conexão está ativa
  onDisconnect(statusRef).set('offline');

  await set(userRef, updatedUser);
  await set(statusRef, 'online');

  // Atualiza entrada nos grupos
  for (const groupId of user.group) {
    const groupMemberRef = ref(database, `grupos/${groupId}/members/${user.id}`);
    await set(groupMemberRef, { status: 'online' });

    const disconnectGroupRef = ref(database, `grupos/${groupId}/members/${user.id}`);
    onDisconnect(disconnectGroupRef).set({ id: user.id, status: 'offline' });
  }
};
