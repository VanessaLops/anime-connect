export type UserType =
  | "Dono_Geral"
  | "Dono_Sala"
  | "Sub_Dono"
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
