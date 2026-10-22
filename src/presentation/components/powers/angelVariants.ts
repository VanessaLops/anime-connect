/**
 * Modelos dos powers Angel e Devil — porte fiel de
 * `anime-connect-v2/components/ui/angelVariants.ts`, o mesmo desenho que
 * aparece no chat e na Loja do app. Se um modelo mudar lá, atualize aqui.
 *
 * Cada variante combina uma **forma** de asa com paleta e auréola próprias.
 */

export type WingShape = "feathered" | "crystal" | "butterfly" | "flame" | "plated" | "bat" | "spiked";

export type AngelVariant =
  | "classic"
  | "gold"
  | "fallen"
  | "crystal"
  | "fire"
  | "ice"
  | "mecha"
  | "butterfly"
  | "phoenix"
  | "archangel"
  | "d-classic"
  | "d-shadow"
  | "d-fire"
  | "d-ice"
  | "d-thorn"
  | "d-mecha"
  | "d-vampire"
  | "d-chaos"
  | "d-royal"
  | "d-arch";

export type HaloStyle = "ring" | "double" | "broken" | "none";

export interface AngelStyle {
  id: AngelVariant;
  label: string;
  /** Frase curta mostrada na galeria de modelos. */
  tagline: string;
  /** A qual power o modelo pertence. */
  family: "angel" | "devil";
  shape: WingShape;
  /** Cor das penas: [ponta, base]. */
  feather: [string, string];
  halo: string;
  haloStyle: HaloStyle;
  /** Velocidade da batida, em ms (abrir). */
  flapMs: number;
}

export const ANGEL_STYLES: Record<AngelVariant, AngelStyle> = {
  classic: {
    id: "classic", family: "angel", tagline: "Penas brancas e auréola dourada", label: "Anjo Clássico", shape: "feathered",
    feather: ["#FFFFFF", "#D8D8E0"], halo: "#FFD700", haloStyle: "ring", flapMs: 700,
  },
  gold: {
    id: "gold", family: "angel", tagline: "Penas douradas com auréola dupla", label: "Anjo Dourado", shape: "feathered",
    feather: ["#FFD700", "#B45309"], halo: "#FFF7CC", haloStyle: "double", flapMs: 760,
  },
  fallen: {
    id: "fallen", family: "angel", tagline: "Asas negras e auréola partida", label: "Anjo Caído", shape: "feathered",
    feather: ["#3F3F46", "#0E0E11"], halo: "#DC2626", haloStyle: "broken", flapMs: 900,
  },
  crystal: {
    id: "crystal", family: "angel", tagline: "Lascas de cristal violeta e azul", label: "Anjo de Cristal", shape: "crystal",
    feather: ["#C4B5FD", "#4FACFE"], halo: "#E4C6FF", haloStyle: "ring", flapMs: 820,
  },
  fire: {
    id: "fire", family: "angel", tagline: "Línguas de fogo, batida rápida", label: "Anjo de Fogo", shape: "flame",
    feather: ["#FFC371", "#DC2626"], halo: "#F79D00", haloStyle: "ring", flapMs: 560,
  },
  ice: {
    id: "ice", family: "angel", tagline: "Cristais de gelo, batida serena", label: "Anjo de Gelo", shape: "crystal",
    feather: ["#89F7FE", "#4B6CB7"], halo: "#D6F4FF", haloStyle: "double", flapMs: 980,
  },
  mecha: {
    id: "mecha", family: "angel", tagline: "Placas metálicas e circuito azul", label: "Anjo Mecânico", shape: "plated",
    feather: ["#D6D6D6", "#4B5563"], halo: "#4FACFE", haloStyle: "ring", flapMs: 620,
  },
  butterfly: {
    id: "butterfly", family: "angel", tagline: "Lobos rosa e roxo, sem auréola", label: "Anjo Borboleta", shape: "butterfly",
    feather: ["#F472B6", "#7C6BE0"], halo: "#FBD3E9", haloStyle: "none", flapMs: 520,
  },
  phoenix: {
    id: "phoenix", family: "angel", tagline: "Chamas douradas renascendo", label: "Anjo Fênix", shape: "flame",
    feather: ["#FFD700", "#8E0E00"], halo: "#FF5F6D", haloStyle: "double", flapMs: 600,
  },
  archangel: {
    id: "archangel", family: "angel", tagline: "Pontas douradas, batida majestosa", label: "Arcanjo", shape: "feathered",
    feather: ["#FFFFFF", "#FFD700"], halo: "#FFFFFF", haloStyle: "double", flapMs: 1100,
  },
  "d-classic": {
    id: "d-classic", family: "devil", tagline: "Asas de morcego vermelhas", label: "Diabinho Clássico", shape: "bat",
    feather: ["#EF4444","#7F1D1D"], halo: "#450A0A", haloStyle: "none", flapMs: 620,
  },
  "d-shadow": {
    id: "d-shadow", family: "devil", tagline: "Asas negras que somem na sombra", label: "Demônio Sombrio", shape: "bat",
    feather: ["#3F3F46","#0E0E11"], halo: "#DC2626", haloStyle: "none", flapMs: 760,
  },
  "d-fire": {
    id: "d-fire", family: "devil", tagline: "Chamas vivas no lugar das asas", label: "Demônio de Fogo", shape: "flame",
    feather: ["#F79D00","#8E0E00"], halo: "#FFD700", haloStyle: "none", flapMs: 520,
  },
  "d-ice": {
    id: "d-ice", family: "devil", tagline: "Espinhos de gelo azul-escuro", label: "Demônio Gélido", shape: "spiked",
    feather: ["#4B6CB7","#182848"], halo: "#89F7FE", haloStyle: "none", flapMs: 900,
  },
  "d-thorn": {
    id: "d-thorn", family: "devil", tagline: "Asas cheias de espinhos afiados", label: "Demônio Espinhoso", shape: "spiked",
    feather: ["#DC2626","#450A0A"], halo: "#F79D00", haloStyle: "none", flapMs: 580,
  },
  "d-mecha": {
    id: "d-mecha", family: "devil", tagline: "Placas de metal e juntas expostas", label: "Demônio Mecânico", shape: "plated",
    feather: ["#6B7280","#1F2937"], halo: "#DC2626", haloStyle: "none", flapMs: 640,
  },
  "d-vampire": {
    id: "d-vampire", family: "devil", tagline: "Membranas roxas de vampiro", label: "Demônio Vampiro", shape: "bat",
    feather: ["#A855F7","#4C1D95"], halo: "#F472B6", haloStyle: "none", flapMs: 700,
  },
  "d-chaos": {
    id: "d-chaos", family: "devil", tagline: "Facetas quebradas e irregulares", label: "Demônio do Caos", shape: "crystal",
    feather: ["#7F1D1D","#0E0E11"], halo: "#F79D00", haloStyle: "none", flapMs: 480,
  },
  "d-royal": {
    id: "d-royal", family: "devil", tagline: "Vermelho e ouro, com coroa de chifres", label: "Demônio Real", shape: "flame",
    feather: ["#DC2626","#B45309"], halo: "#FFD700", haloStyle: "none", flapMs: 680,
  },
  "d-arch": {
    id: "d-arch", family: "devil", tagline: "O mais raro: asas imensas e aura negra", label: "Arquidemônio", shape: "bat",
    feather: ["#0E0E11","#DC2626"], halo: "#FF5F6D", haloStyle: "none", flapMs: 1000,
  },
};

export const ANGEL_LIST = Object.values(ANGEL_STYLES);

export type PowerFamily = AngelStyle["family"];

/** Os 10 modelos de um pacote (Angel ou Devil), na ordem do catálogo. */
export function variantsOf(family: PowerFamily): AngelStyle[] {
  return ANGEL_LIST.filter((style) => style.family === family);
}

/**
* Caminhos SVG de cada forma, no viewBox 100×110.
* Três camadas: [fundo, meio, frente] — dá profundidade sem usar imagem.
*/
export const WING_PATHS: Record<WingShape, [string, string, string]> = {
  // penas longas e curvas, o anjo tradicional
  feathered: [
    "M96 18 C60 26, 22 52, 6 100 C34 88, 62 62, 96 40 Z",
    "M96 14 C64 20, 32 42, 18 82 C44 70, 68 48, 96 32 Z",
    "M96 10 C70 14, 44 30, 32 60 C54 50, 74 34, 96 24 Z",
  ],
  // facetas retas, como lascas de cristal
  crystal: [
    "M96 16 L40 44 L8 98 L44 74 L96 38 Z",
    "M96 12 L48 36 L20 80 L52 60 L96 30 Z",
    "M96 8 L58 28 L34 60 L62 46 L96 22 Z",
  ],
  // lobos arredondados de borboleta
  butterfly: [
    "M96 20 C52 14, 12 44, 14 78 C18 102, 56 92, 96 46 Z",
    "M96 16 C60 12, 26 40, 28 70 C32 88, 62 78, 96 38 Z",
    "M96 12 C70 10, 44 32, 46 56 C50 70, 72 62, 96 28 Z",
  ],
  // línguas de fogo, pontas afiladas
  flame: [
    "M96 18 C64 22, 30 44, 10 96 C30 84, 40 92, 54 66 C64 76, 74 56, 96 40 Z",
    "M96 14 C68 18, 38 38, 22 80 C38 70, 46 78, 58 56 C68 64, 76 48, 96 32 Z",
    "M96 10 C74 14, 50 30, 38 62 C50 54, 56 60, 66 44 C74 50, 80 38, 96 24 Z",
  ],
  // membrana de morcego, com os "dedos" marcados
  bat: [
    "M96 16 C58 20, 24 46, 8 96 C26 78, 34 84, 44 66 C52 76, 58 62, 70 50 C78 56, 84 44, 96 36 Z",
    "M96 12 C64 16, 34 38, 20 78 C34 64, 42 70, 50 54 C58 62, 64 50, 74 42 C80 48, 86 38, 96 30 Z",
    "M96 8 C72 12, 48 30, 36 58 C48 48, 54 54, 60 42 C66 48, 72 40, 80 34 C84 38, 88 32, 96 22 Z",
  ],
  // espinhos retos saindo de uma base grossa
  spiked: [
    "M96 18 L52 34 L58 46 L18 62 L26 74 L4 96 L38 78 L34 66 L70 50 L64 40 L96 34 Z",
    "M96 14 L58 28 L62 40 L28 56 L34 66 L16 82 L44 68 L42 58 L74 44 L70 36 L96 28 Z",
    "M96 10 L66 22 L68 32 L42 46 L46 54 L32 66 L54 56 L52 48 L78 38 L76 30 L96 20 Z",
  ],

  // placas segmentadas, com vãos entre elas
  plated: [
    "M96 18 L52 36 L48 52 L14 74 L12 96 L52 70 L58 56 L96 38 Z",
    "M96 14 L58 30 L54 44 L26 62 L24 80 L58 60 L64 48 L96 30 Z",
    "M96 10 L64 24 L60 36 L38 50 L36 64 L64 50 L70 40 L96 22 Z",
  ],
};
