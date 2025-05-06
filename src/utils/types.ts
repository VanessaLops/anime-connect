export type Papel = 'visitante' | 'membro' | 'dono';

export interface Usuario {
  id: string;
  nome: string;
}

export interface Grupo {
  id: string;
  nome: string;
  imagem: string;
  background_image: string;
  participantes: {
    usuarioId: string;
    papel: Papel;
  }[];
}
