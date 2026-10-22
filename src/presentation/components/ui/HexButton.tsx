import type { ReactNode } from "react";

type HexButtonVariant = "primary" | "ghost";

interface HexButtonProps {
  href: string;
  children: ReactNode;
  variant?: HexButtonVariant;
}

const VARIANT_STYLES: Record<HexButtonVariant, string> = {
  // botão "Jogar": fundo hextech azul com moldura dourada
  primary:
    "border-hex-gold bg-gradient-to-b from-[#0A323C] to-hex-panel text-hex-gold-light hover:border-hex-gold-light hover:shadow-[0_0_28px_-4px_rgba(10,200,185,0.6)]",
  ghost:
    "border-hex-gold-dark bg-hex-navy/60 text-hex-gold hover:border-hex-gold hover:text-hex-gold-light",
};

/** Link com cara de botão de cliente de jogo — borda dupla e brilho no hover. */
export default function HexButton({ href, children, variant = "primary" }: HexButtonProps) {
  return (
    <a
      href={href}
      className={`relative inline-flex min-w-48 items-center justify-center border-2 px-8 py-3 font-display text-sm font-bold uppercase tracking-[0.2em] transition after:pointer-events-none after:absolute after:inset-[3px] after:border after:border-hex-gold/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hex-blue ${VARIANT_STYLES[variant]}`}
    >
      {children}
    </a>
  );
}
