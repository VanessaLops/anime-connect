

export type UserType = "Dono_Geral" | "Admin_mod" | "Dono_Sala" | "Staff" | "Membro" | "Visitante";
import { db, ref, set, get, child } from "../../firebase";
export interface User {
  username: string;
  type: UserType;
  power: number;
  group: string[]; 
  relacionamento?: string;
}

// Valida se a string é um UserType válido
const isValidUserType = (type: UserType) => {
  return ["Dono_Geral", "Admin_mod", "Dono_Sala", "Staff", "Membro", "Visitante"].includes(type);
};

const AJUDA_GROUP_ID = "d03330f1-834a-4535-af18-6a805642c962";

// Função para obter IP público do usuário
export const getUserIP = async (): Promise<string | null> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Erro ao obter IP:', error);
    return null;
  }
};

export const saveUserAsVisitor = async (): Promise<User> => {
  const ip = await getUserIP();

  const visitante: User = {
    username: ip ? `Visitante_${ip}` : `Visitante_${Math.floor(Math.random() * 100000)}`,
    type: "Visitante",
    power: 1,
    group: [AJUDA_GROUP_ID], // Sempre atribui o grupo "Ajuda" primeiro
    relacionamento: '',
  };
};

    await set(ref(db, `users/${userId}`), user);
  localStorage.setItem('chat_user', JSON.stringify(visitante));
  return visitante;
};

export const getUserFromLocalStorage = (): User | null => {
  if (typeof window === 'undefined') return null;

  const userString = localStorage.getItem('chat_user');
  if (!userString) return null;

  try {
    const parsed = JSON.parse(userString);
    if (
      typeof parsed.username === 'string' &&
      typeof parsed.power === 'number' &&
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

