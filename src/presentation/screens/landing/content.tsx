import type { ReactNode } from "react";

export const CRAWL_LINES: string[] = [
  "Havia um tempo em que cada fã de anime era uma estrela sozinha: brilhando em algoritmos diferentes, em feeds diferentes, sem se ver.",
  "O silêncio entre essas estrelas crescia. Comunidades fragmentadas, conversas perdidas em mil aplicativos — uma galáxia sem constelação.",
  "Mas um sinal foi enviado através do vazio. Uma frota está se formando para reunir essas estrelas soltas numa única galáxia conectada.",
  "Quem sobe de patente na frota não ganha só um título — desbloqueia powers: asas de anjo brilhando ao lado do nome, ou a aura sombria de quem escolheu o outro lado da galáxia.",
  "É o primeiro sinal da beta galaxy — antes da grande jornada, antes da v1. A tripulação está sendo recrutada agora.",
];

export interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
}

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  className: "h-5 w-5",
} as const;

export const FEATURES: Feature[] = [
  {
    title: "Chat em Tempo Real",
    description:
      "Converse instantaneamente com outros exploradores, em grupo ou no privado, sem delay entre galáxias.",
    icon: (
      <svg {...iconProps}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 10h8M8 14h5M21 12c0 4.418-4.03 8-9 8-1.06 0-2.078-.163-3.024-.463L3 21l1.5-4.5C3.55 15.055 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
        />
      </svg>
    ),
  },
  {
    title: "Comunidade & Grupos",
    description:
      "Encontre sua tripulação: grupos por interesse, squads de anime e eventos feitos pela comunidade.",
    icon: (
      <svg {...iconProps}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 20h5v-1a4 4 0 0 0-4-4h-1m-6 5H2v-1a4 4 0 0 1 4-4h1m8-5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    ),
  },
  {
    title: "Perfil Personalizado",
    description:
      "Sua nave, seu jeito: foto, hobbies e uma bio pra mostrar quem você é no universo AnimeConnect.",
    icon: (
      <svg {...iconProps}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0"
        />
      </svg>
    ),
  },
  {
    title: "Sistema de Níveis",
    description: "Suba de patente, ganhe XP e desbloqueie recursos novos conforme avança na jornada.",
    icon: (
      <svg {...iconProps}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m6 15 6-6 6 6M6 20l6-6 6 6" />
      </svg>
    ),
  },
  {
    title: "Tradução Automática",
    description: "Fale com pilotos de qualquer canto do mundo — a barreira do idioma fica pra trás.",
    icon: (
      <svg {...iconProps}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9m0 18c2.5-2.5 3.5-5.5 3.5-9s-1-6.5-3.5-9M3.5 9h17M3.5 15h17"
        />
      </svg>
    ),
  },
  {
    title: "Segurança & Privacidade",
    description: "Suas conversas são protegidas. Sem vazamento de coordenadas.",
    icon: (
      <svg {...iconProps}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3 4.5 6v6c0 4.5 3.2 7.7 7.5 9 4.3-1.3 7.5-4.5 7.5-9V6L12 3Zm-2.5 9 1.8 1.8L14.8 10"
        />
      </svg>
    ),
  },
];

export const FLEET_RANKS: string[] = [
  "Recruta",
  "Cadete",
  "Piloto",
  "Comandante",
  "Almirante",
  "Lenda da Galáxia",
];

export type PowerRarity = "comum" | "raro" | "épico" | "lendário";

export interface PowerTeaser {
  name: string;
  rarity: PowerRarity;
  description: string;
}

// Prévia dos powers menores da loja do app — catálogo completo em desenvolvimento.
export const POWER_TEASERS: PowerTeaser[] = [
  {
    name: "Namegrad",
    rarity: "comum",
    description: "Seu nome corre em gradiente, letra a letra, por uma paleta de 6 cores.",
  },
  {
    name: "Invisible",
    rarity: "épico",
    description: "Some da lista de membros e continua vendo tudo — ninguém sabe que você tá online.",
  },
];

export type PowerAccent = "gold" | "pink";

export interface AngelDevilPower {
  emoji: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  models: string[];
  accent: PowerAccent;
}

// Os dois powers de peão da loja — o par mais visível do catálogo, cada um
// com 10 modelos no mesmo pacote. Dados vêm do catálogo real do app.
export const ANGEL_DEVIL_POWERS: AngelDevilPower[] = [
  {
    emoji: "👼",
    name: "Angel",
    tagline: "O lado da luz",
    description:
      "Pacote com 10 modelos de asas e auréola batendo do seu lado no chat — do clássico penas brancas ao anjo mecânico de circuitos azuis.",
    price: 800,
    models: ["Anjo Clássico", "Arcanjo", "Anjo Fênix"],
    accent: "gold",
  },
  {
    emoji: "😈",
    name: "Devil",
    tagline: "O lado sombrio",
    description:
      "10 modelos de chifres e aura sombria — de asas de morcego clássicas ao arquidemônio, o mais raro do pacote.",
    price: 800,
    models: ["Diabinho Clássico", "Arquidemônio", "Demônio Real"],
    accent: "pink",
  },
];
