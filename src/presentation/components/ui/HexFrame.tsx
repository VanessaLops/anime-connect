import type { ReactNode } from "react";

type FrameElement = "div" | "article" | "li";

interface HexFrameProps {
  children: ReactNode;
  as?: FrameElement;
  /** Destaque: borda dourada cheia em vez da escura. */
  highlight?: boolean;
  className?: string;
}

// Cantos dourados em "L" — o detalhe que dá cara de moldura de cliente de jogo.
const CORNER_BASE = "pointer-events-none absolute z-10 h-3 w-3 border-hex-gold";
const CORNERS = [
  "-left-px -top-px border-l-2 border-t-2",
  "-right-px -top-px border-r-2 border-t-2",
  "-bottom-px -left-px border-b-2 border-l-2",
  "-bottom-px -right-px border-b-2 border-r-2",
];

/** Painel com borda fina e cantos ornamentados, base de todo card da landing. */
export default function HexFrame({
  children,
  as: Element = "div",
  highlight = false,
  className = "",
}: HexFrameProps) {
  const border = highlight
    ? "border-hex-gold/70"
    : "border-hex-gold-dark/60 hover:border-hex-gold/70";

  return (
    <Element
      className={`relative border bg-gradient-to-b from-hex-panel/90 to-hex-navy/95 transition-colors ${border} ${className}`}
    >
      {CORNERS.map((position) => (
        <span key={position} className={`${CORNER_BASE} ${position}`} aria-hidden="true" />
      ))}
      {children}
    </Element>
  );
}
