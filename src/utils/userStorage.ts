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
