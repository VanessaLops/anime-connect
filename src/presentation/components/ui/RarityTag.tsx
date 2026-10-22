export type PowerRarity = "comum" | "raro" | "épico" | "lendário";

// Mesmas cores de raridade da Loja do app (RARITY_COLOR em catalog.ts).
const RARITY_STYLES: Record<PowerRarity, string> = {
  comum: "border-gray-400/30 bg-gray-400/10 text-gray-300",
  raro: "border-[#4FACFE]/40 bg-[#4FACFE]/10 text-[#7cc2ff]",
  épico: "border-[#A855F7]/40 bg-[#A855F7]/15 text-[#d1a8ff]",
  lendário: "border-hex-gold/50 bg-hex-gold/10 text-hex-gold",
};

export default function RarityTag({ rarity }: { rarity: PowerRarity }) {
  return (
    <span
      className={`inline-flex items-center border px-2.5 py-0.5 font-display text-[10px] uppercase tracking-[0.15em] ${RARITY_STYLES[rarity]}`}
    >
      {rarity}
    </span>
  );
}
