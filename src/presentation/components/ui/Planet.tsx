import type { ReactNode } from "react";

export type PlanetTone = "gold" | "crimson" | "cyan" | "violet" | "pink" | "teal" | "abyss";

interface ToneColors {
  light: string;
  mid: string;
  dark: string;
  glow: string;
}

const TONES: Record<PlanetTone, ToneColors> = {
  gold: { light: "#FFF3B0", mid: "#F5B83D", dark: "#5C2E00", glow: "rgba(255,200,60,0.45)" },
  crimson: { light: "#FF8A7A", mid: "#B3122E", dark: "#1A0006", glow: "rgba(220,38,38,0.45)" },
  cyan: { light: "#C7FBFF", mid: "#22B8CF", dark: "#062A3A", glow: "rgba(0,255,255,0.35)" },
  violet: { light: "#E4C6FF", mid: "#7928CA", dark: "#14052B", glow: "rgba(121,40,202,0.45)" },
  pink: { light: "#FFC2E0", mid: "#FF0080", dark: "#2B0016", glow: "rgba(255,0,128,0.4)" },
  teal: { light: "#B8FFE0", mid: "#14A37F", dark: "#022019", glow: "rgba(20,163,127,0.4)" },
  // planeta de horizonte: quase todo na sombra, só a atmosfera acesa na borda
  abyss: { light: "#3FB8C8", mid: "#0B3A4A", dark: "#010A13", glow: "rgba(10,200,185,0.55)" },
};

const SHADOW_SIDE = "radial-gradient(circle at 72% 78%, rgba(0,0,0,0.75), transparent 62%)";
// A imagem de faixas tem 2x a largura do planeta; andar uma largura inteira
// (ver keyframe `planet-spin`) fecha o loop sem emenda.
const BANDS_SIZE = "200% 100%";

interface PlanetProps {
  tone: PlanetTone;
  /** Largura (o planeta é sempre quadrado). Ex.: `w-64`. */
  className?: string;
  ring?: boolean;
  /** Conteúdo centralizado por cima do planeta. */
  children?: ReactNode;
}

// Planeta em CSS puro: luz no canto superior, faixas de atmosfera girando
// devagar e sombra do lado oposto. Server Component, decorativo.
export default function Planet({ tone, className = "", ring = false, children }: PlanetProps) {
  const c = TONES[tone];
  const ringClass =
    "pointer-events-none absolute left-1/2 top-1/2 h-[28%] w-[165%] -translate-x-1/2 -translate-y-1/2 -rotate-[14deg] rounded-[50%] border-[3px]";

  return (
    <div className={`relative aspect-square ${className}`}>
      {/* metade de trás do anel, escondida atrás do planeta */}
      {ring && <div className={ringClass} style={{ borderColor: c.light, opacity: 0.35 }} aria-hidden="true" />}

      <div
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{
          background: `radial-gradient(circle at 32% 28%, ${c.light}, ${c.mid} 42%, ${c.dark} 100%)`,
          boxShadow: `0 0 80px -6px ${c.glow}, inset -10px -14px 40px rgba(0,0,0,0.55)`,
        }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 animate-planet-spin opacity-25 mix-blend-overlay"
          style={{
            backgroundImage: `repeating-linear-gradient(172deg, transparent 0 8%, ${c.light} 8% 11%, transparent 11% 19%, ${c.dark} 19% 23%)`,
            backgroundSize: BANDS_SIZE,
          }}
        />
        <div className="absolute inset-0" style={{ background: SHADOW_SIDE }} />
      </div>

      {/* metade da frente do anel, por cima do planeta */}
      {ring && (
        <div
          className={`${ringClass} [clip-path:inset(50%_0_0_0)]`}
          style={{ borderColor: c.light, opacity: 0.7 }}
          aria-hidden="true"
        />
      )}

      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  );
}
