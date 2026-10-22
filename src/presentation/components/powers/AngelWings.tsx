import type { CSSProperties } from "react";
import Mascot from "@/presentation/components/powers/Mascot";
import {
  ANGEL_STYLES,
  WING_PATHS,
  type AngelVariant,
  type HaloStyle,
  type WingShape,
} from "@/presentation/components/powers/angelVariants";

// Proporções do app (anime-connect-v2/components/ui/AngelWings.tsx), todas em
// relação a `size` — o desenho escala sem perder a forma.
const BOX_WIDTH = 2.5;
const BOX_HEIGHT = 1.7;
const WING_WIDTH = 0.95;
const WING_HEIGHT = 1.05;
const SHOULDER_GAP = 0.24;
const MASCOT_SIZE = 0.8;
const HALO_WIDTH = 0.72;
const HALO_HEIGHT = 0.3;

// Pose parada (= início da batida). A animação sobrescreve enquanto roda;
// com `still` ou prefers-reduced-motion, é isso que aparece.
const LEFT_WING_REST = "rotate(-14deg)";
const RIGHT_WING_REST = "rotate(14deg)";
const HALO_REST_OPACITY = 0.75;
// Dobradiça no ombro: borda interna da asa, um pouco abaixo do meio.
const LEFT_WING_ORIGIN = "100% 60%";
const RIGHT_WING_ORIGIN = "0% 60%";

interface AngelWingsProps {
  variant: AngelVariant;
  /** Tamanho do mascote de referência, em px. */
  size: number;
  /** Desliga o movimento. */
  still?: boolean;
}

/**
 * Power **Angel/Devil**: asas batendo e auréola flutuando em volta do
 * mascote. O mesmo SVG do app, animado em CSS — abre mais rápido do que
 * fecha (`--flap-ms` por modelo), como lá.
 */
export default function AngelWings({ variant, size, still = false }: AngelWingsProps) {
  const style = ANGEL_STYLES[variant];
  const wingWidth = size * WING_WIDTH;
  const wingHeight = size * WING_HEIGHT;
  const wingTop = (size * BOX_HEIGHT - wingHeight) / 2;
  const motionVars = {
    "--flap-ms": `${style.flapMs}ms`,
    "--power-size": `${size}px`,
  } as CSSProperties;

  return (
    <div
      role="img"
      aria-label={`${style.label}: ${style.tagline}`}
      className="relative flex shrink-0 items-center justify-center"
      style={{ width: size * BOX_WIDTH, height: size * BOX_HEIGHT, ...motionVars }}
    >
      {/* asa esquerda — dobradiça no ombro */}
      <div
        className={`absolute ${still ? "" : "animate-wing-left"}`}
        style={{ right: "50%", marginRight: size * SHOULDER_GAP, top: wingTop, transform: LEFT_WING_REST, transformOrigin: LEFT_WING_ORIGIN }}
      >
        <Wing width={wingWidth} height={wingHeight} shape={style.shape} feather={style.feather} id={variant} />
      </div>

      {/* asa direita — mesma forma espelhada */}
      <div
        className={`absolute ${still ? "" : "animate-wing-right"}`}
        style={{ left: "50%", marginLeft: size * SHOULDER_GAP, top: wingTop, transform: RIGHT_WING_REST, transformOrigin: RIGHT_WING_ORIGIN }}
      >
        <div className="-scale-x-100">
          <Wing width={wingWidth} height={wingHeight} shape={style.shape} feather={style.feather} id={variant} />
        </div>
      </div>

      {style.haloStyle !== "none" && (
        <div className="absolute inset-x-0 top-0 flex justify-center">
          <div className={still ? "" : "animate-halo-float"} style={{ opacity: HALO_REST_OPACITY }}>
            <Halo size={size} color={style.halo} kind={style.haloStyle} />
          </div>
        </div>
      )}

      <div className="relative z-10">
        <Mascot kind={style.family} size={size * MASCOT_SIZE} still={still} />
      </div>
    </div>
  );
}

interface WingProps {
  width: number;
  height: number;
  shape: WingShape;
  feather: [string, string];
  id: string;
}

function Wing({ width, height, shape, feather, id }: WingProps) {
  const [tip, base] = feather;
  const gradientId = `feather-${id}`;
  const [back, mid, front] = WING_PATHS[shape];

  return (
    <svg width={width} height={height} viewBox="0 0 100 110" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={tip} stopOpacity={1} />
          <stop offset="1" stopColor={base} stopOpacity={0.75} />
        </linearGradient>
      </defs>
      <path d={back} fill={`url(#${gradientId})`} opacity={0.5} />
      <path d={mid} fill={`url(#${gradientId})`} opacity={0.8} />
      <path d={front} fill={tip} />
    </svg>
  );
}

/** Auréola: anel simples, duplo (com brilho) ou partido (anjo caído). */
function Halo({ size, color, kind }: { size: number; color: string; kind: HaloStyle }) {
  return (
    <svg width={size * HALO_WIDTH} height={size * HALO_HEIGHT} viewBox="0 0 60 24" aria-hidden="true">
      {kind === "double" && (
        <ellipse cx="30" cy="12" rx="26" ry="8" stroke={color} strokeWidth={6} fill="none" opacity={0.3} />
      )}
      {kind === "broken" ? (
        <>
          <path d="M8 14 A26 8 0 0 1 26 5" stroke={color} strokeWidth={2.5} fill="none" />
          <path d="M36 5 A26 8 0 0 1 52 14" stroke={color} strokeWidth={2.5} fill="none" />
        </>
      ) : (
        <ellipse cx="30" cy="12" rx="26" ry="8" stroke={color} strokeWidth={2.5} fill="none" />
      )}
    </svg>
  );
}
