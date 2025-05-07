import { database } from "../../firebase";
import { ref, set, get } from "firebase/database";

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
  image: string[]
}

const AJUDA_GROUP_ID = "d03330f1-834a-4535-af18-6a805642c962";

const generateUsername = () => {
  const animeNames = ["Naruto", "Sasuke", "Goku", "Luffy", "Saitama", "Hinata", "Kakashi", "Mikasa", "Yuno", "Light"];
  const randomName1 = animeNames[Math.floor(Math.random() * animeNames.length)];
  const randomName2 = animeNames[Math.floor(Math.random() * animeNames.length)];
  const randomNumber = Math.floor(Math.random() * 100000);
  return `${randomName1}${randomName2}${randomNumber}`;
};


const generateAvatars = () => {
  const avatarUrls = [];
  for (let i = 0; i < 10; i++) {
    avatarUrls.push(`https://api.dicebear.com/6.x/croodles-neutral/svg?seed=${Math.floor(Math.random() * 100000)}`);
  }
  return avatarUrls;
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


export const saveUserAsVisitor = async (): Promise<User> => {
  const existingId = getVisitorIdFromCookie();


  if (existingId) {
    const snapshot = await get(ref(database, `visitors/${existingId}`));
    if (snapshot.exists()) {

      console.log("Visitante já existe no Firebase:", snapshot.val());
      return snapshot.val();
    } else {

      document.cookie = "visitor_id=; path=/; max-age=0";
    }
  }
  const ip = await getUserIP();
  const device = isMobileDevice() ? "mobile" : "desktop";
  const uuid = crypto.randomUUID();

  const username = generateUsername();
  const avatars = generateAvatars();

  const visitante: User = {
    id: uuid,
    username: ip ? `${username}` : `${username}`,
    type: "Visitante",
    power: 0,
    group: [AJUDA_GROUP_ID],
    relacionamento: "",
    image: avatars
  };


  await set(ref(database, `visitors/${uuid}`), {
    ...visitante,
    ip: ip ?? "unknown",
    device,
    timestamp: new Date().toISOString(),
  });

  document.cookie = `visitor_id=${uuid}; path=/; max-age=31536000`;

  console.log("Novo visitante criado e salvo:", visitante);
  return visitante;
};
