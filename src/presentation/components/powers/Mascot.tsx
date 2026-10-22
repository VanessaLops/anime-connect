import type { PowerFamily } from "@/presentation/components/powers/angelVariants";

const PALETTE: Record<PowerFamily, { body: string; shade: string; blush: string; horn: string }> = {
  angel: { body: "#F9A8D4", shade: "#F472B6", blush: "#FB7185", horn: "#FFD700" },
  devil: { body: "#EF4444", shade: "#B91C1C", blush: "#7F1D1D", horn: "#450A0A" },
};

const EYE_COLOR = "#1F2937";
// Piscada escala o olho no próprio eixo — sem isso o scaleY gira em volta do
// canto do SVG e o olho "pula" pra cima.
const EYE_CLASS = "[transform-box:fill-box] origin-center";

interface MascotProps {
  kind: PowerFamily;
  size: number;
  still?: boolean;
}

/**
 * Mascote chibi do meio das asas — mesmo desenho de
 * `anime-connect-v2/components/ui/Mascot.tsx`. Lá anima com `Animated`; aqui
 * é CSS puro: flutua, respira e pisca em tempos diferentes (junto fica
 * mecânico).
 */
export default function Mascot({ kind, size, still = false }: MascotProps) {
  const c = PALETTE[kind];
  return (
    <span className={`block ${still ? "" : "animate-mascot-bob"}`} style={{ width: size, height: size }}>
      <span className={`block ${still ? "" : "animate-mascot-breathe"}`}>
        <svg width={size} height={size} viewBox="0 0 60 60" aria-hidden="true">
          <ellipse cx="30" cy="34" rx="20" ry="19" fill={c.body} />
          <path d="M12 40 Q30 58, 48 40 Q30 53, 12 40 Z" fill={c.shade} opacity={0.55} />

          {kind === "angel" ? (
            <>
              <ellipse cx="15" cy="20" rx="6" ry="8" fill={c.body} />
              <ellipse cx="45" cy="20" rx="6" ry="8" fill={c.body} />
            </>
          ) : (
            <>
              <path d="M14 20 L10 6 L22 16 Z" fill={c.horn} />
              <path d="M46 20 L50 6 L38 16 Z" fill={c.horn} />
            </>
          )}

          <ellipse
            className={`${EYE_CLASS} ${still ? "" : "animate-blink"}`}
            cx="23"
            cy="32"
            rx="3.2"
            ry="4.2"
            fill={EYE_COLOR}
          />
          <ellipse
            className={`${EYE_CLASS} ${still ? "" : "animate-blink"}`}
            cx="37"
            cy="32"
            rx="3.2"
            ry="4.2"
            fill={EYE_COLOR}
          />
          <circle cx="24.2" cy="30.4" r="1.2" fill="#FFFFFF" />
          <circle cx="38.2" cy="30.4" r="1.2" fill="#FFFFFF" />

          <ellipse cx="17" cy="38" rx="3.4" ry="2.2" fill={c.blush} opacity={0.6} />
          <ellipse cx="43" cy="38" rx="3.4" ry="2.2" fill={c.blush} opacity={0.6} />

          {kind === "angel" ? (
            <path d="M26 41 Q30 45, 34 41" stroke={EYE_COLOR} strokeWidth={1.6} fill="none" strokeLinecap="round" />
          ) : (
            <path d="M25 42 L30 45 L35 42" stroke={EYE_COLOR} strokeWidth={1.6} fill="none" strokeLinecap="round" />
          )}

          {kind === "devil" && (
            <path
              d="M49 44 Q58 46, 55 54 L58 52 L56 57 L51 55 L54 54 Q56 48, 48 47 Z"
              fill={c.shade}
            />
          )}
        </svg>
      </span>
    </span>
  );
}
