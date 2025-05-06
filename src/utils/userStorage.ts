export type UserType = "Dono_Geral" | "Admin_mod" | "Dono_Sala" | "Staff" | "Membro" | "Visitante";

export interface User {
  username: string;
  type: UserType;
  power: number;
  group: number[];
  relacionamento?: string;
}

// Obtém usuário do localStorage (se existir)
export const getUserFromLocalStorage = (): User | null => {
  if (typeof window === 'undefined') return null;

  const user = localStorage.getItem('chat_user');
  return user ? JSON.parse(user) as User : null;
};

// Função para pegar IP público
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

// Salva um novo usuário Visitante no localStorage com IP real
export const saveUserAsVisitor = async (): Promise<User> => {
  const ip = await getUserIP();

  const visitante: User = {
    username: ip ? `Visitante_${ip}` : `Visitante_${Math.floor(Math.random() * 100000)}`,
    type: "Visitante",
    power: 1,
    group: [0], // Grupo 0 = acesso a todos os grupos
  };

  localStorage.setItem('chat_user', JSON.stringify(visitante));
  return visitante;
};
