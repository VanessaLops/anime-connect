import type { CSSProperties } from "react";

export type NameEffect = "grad" | "glow" | "wave";

// Passo do "tick" compartilhado do app (~8 quadros/s). Defasar cada letra por
// um tick reproduz a cor correndo (grad) e a onda (wave) de lá.
const TICK_MS = 130;

const LETTER_EFFECT_CLASS: Record<Exclude<NameEffect, "glow">, string> = {
  grad: "animate-namegrad",
  wave: "animate-namewave",
};

interface PowerNameProps {
  name: string;
  effect: NameEffect;
  className?: string;
}

/**
 * Nome com um power de nome aplicado — mesmo efeito de
 * `anime-connect-v2/components/ui/PowerText.tsx`, em CSS.
 */
export default function PowerName({ name, effect, className = "" }: PowerNameProps) {
  if (effect === "glow") {
    return <span className={`animate-nameglow font-bold ${className}`}>{name}</span>;
  }

  return (
    <span className={`font-bold ${className}`} aria-label={name}>
      {name.split("").map((letter, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={`inline-block ${LETTER_EFFECT_CLASS[effect]}`}
          style={{ animationDelay: `${-index * TICK_MS}ms` } as CSSProperties}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}
