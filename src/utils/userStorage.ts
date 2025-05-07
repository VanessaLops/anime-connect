import { database } from "../../firebase";
import { ref, set, push } from "firebase/database";

export type UserType = "Dono_Geral" | "Admin_mod" | "Dono_Sala" | "Staff" | "Membro" | "Visitante";

export interface User {
  username: string;
  type: UserType;
  power: number;
  group: string[];
  relacionamento?: string;
}

const isValidUserType = (type: UserType) => {
  return ["Dono_Geral", "Admin_mod", "Dono_Sala", "Staff", "Membro", "Visitante"].includes(type);
};

const AJUDA_GROUP_ID = "d03330f1-834a-4535-af18-6a805642c962";

export const getUserIP = async (): Promise<string | null> => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
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

export const saveUserAsVisitor = async (): Promise<User> => {
  const ip = await getUserIP();
  const device = isMobileDevice() ? "mobile" : "desktop";

  const visitante: User = {
    username: ip ? `Visitante_${ip}` : `Visitante_${Math.floor(Math.random() * 100000)}`,
    type: "Visitante",
    power: 1,
    group: [AJUDA_GROUP_ID],
    relacionamento: '',
  };

  console.log(">> saveUserAsVisitor visitante:", visitante);

  try {
    const visitorsListRef = ref(database, "visitors");
    console.log(">> referenciando nó /visitors:", visitorsListRef.toString());

    const visitorRef = push(visitorsListRef);
    console.log(">> nova chave gerada:", visitorRef.key);

    await set(visitorRef, {
      ip: ip || "unknown",
      device,
      user: visitante,
      timestamp: new Date().toISOString(),
    });
    console.log("✅ gravação bem‑sucedida em /visitors/" + visitorRef.key);
  } catch (error) {
    console.error("❌ erro ao salvar visitante no Realtime Database:", error);
  }

  localStorage.setItem("chat_user", JSON.stringify(visitante));
  return visitante;
};

export const getUserFromLocalStorage = (): User | null => {
  if (typeof window === 'undefined') return null;

  const userString = localStorage.getItem("chat_user");
  if (!userString) return null;

  try {
    const parsed = JSON.parse(userString);
    if (
      typeof parsed.username === "string" &&
      typeof parsed.power === "number" &&
      Array.isArray(parsed.group) &&
      isValidUserType(parsed.type)
    ) {
      return parsed as User;
    } else {
      return null;
    }
  } catch (err) {
    console.error("Erro ao parsear usuário do localStorage:", err);
    return null;
  }
};
