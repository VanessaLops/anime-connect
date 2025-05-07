import { database } from "../../firebase";
import { ref, set } from "firebase/database";

export type UserType =
  | "Dono_Geral"
  | "Admin_mod"
  | "Dono_Sala"
  | "Staff"
  | "Membro"
  | "Visitante";

export interface User {
  id: string;            // <- adicionamos aqui
  username: string;
  type: UserType;
  power: number;
  group: string[];
  relacionamento?: string;
}

const AJUDA_GROUP_ID = "d03330f1-834a-4535-af18-6a805642c962";

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

export const saveUserAsVisitor = async (): Promise<User> => {
  const ip = await getUserIP();
  const device = isMobileDevice() ? "mobile" : "desktop";

  // 1) Geramos nosso próprio ID
  const uuid = crypto.randomUUID();

  // 2) Montamos o objeto de visitante COM esse ID
  const visitante: User = {
    id: uuid,
    username: ip ? `Visitante_${ip}` : `Visitante_${Math.floor(Math.random() * 100000)}`,
    type: "Visitante",
    power: 1,
    group: [AJUDA_GROUP_ID],
    relacionamento: "",
  };

  console.log(">> saveUserAsVisitor visitante:", visitante);

  try {
    // 3) Usamos set em vez de push, para usar uuid como chave
    const node = ref(database, `visitors/${uuid}`);
    console.log(">> gravando em /visitors/" + uuid);

    await set(node, {
      ...visitante,
      ip: ip ?? "unknown",
      device,
      timestamp: new Date().toISOString(),
    });
    console.log("✅ gravação bem‑sucedida em /visitors/" + uuid);
  } catch (error) {
    console.error("❌ erro ao salvar visitante no Realtime Database:", error);
  }

  // 4) Salvamos no localStorage TODO o objeto, incluindo o ID
  localStorage.setItem("chat_user", JSON.stringify(visitante));
  return visitante;
};

export const getUserFromLocalStorage = (): User | null => {
  if (typeof window === "undefined") return null;
  const s = localStorage.getItem("chat_user");
  if (!s) return null;
  try {
    return JSON.parse(s) as User;
  } catch {
    return null;
  }
};
