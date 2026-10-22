interface RankBadgeProps {
  label: string;
  /** Posição na escada de patentes, começando em 1. */
  tier: number;
  active?: boolean;
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/** Emblema de patente: losango com o numeral, no estilo dos elos ranqueados. */
export default function RankBadge({ label, tier, active = false }: RankBadgeProps) {
  const emblem = active
    ? "border-hex-gold bg-gradient-to-br from-hex-gold/40 to-hex-gold-dark/40 text-hex-gold-light shadow-[0_0_24px_-2px_rgba(200,170,110,0.6)]"
    : "border-hex-gold-dark/70 bg-hex-panel text-hex-gold-dark";

  return (
    <li className="relative flex w-24 flex-col items-center gap-4">
      <div className={`flex h-12 w-12 rotate-45 items-center justify-center border-2 ${emblem}`}>
        <span className="-rotate-45 font-display text-sm font-bold">{ROMAN[tier - 1]}</span>
      </div>
      <span
        className={`text-center font-display text-xs font-bold uppercase tracking-wider ${active ? "text-hex-gold" : "text-hex-gold-light/50"}`}
      >
        {label}
      </span>
    </li>
  );
}
