import type { PowerRarity } from "@/presentation/screens/landing/content";

interface PowerCardProps {
  name: string;
  rarity: PowerRarity;
  description: string;
}

const RARITY_STYLES: Record<PowerRarity, string> = {
  comum: "text-gray-300",
  raro: "text-anime-cyan",
  épico: "text-anime-purple",
  lendário: "text-holo-gold",
};

export default function PowerCard({ name, rarity, description }: PowerCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur">
      <p className="font-display text-sm font-bold uppercase tracking-wide">
        <span className={RARITY_STYLES[rarity]}>{name}</span>{" "}
        <span className="text-gray-500">· {rarity}</span>
      </p>
      <p className="mt-1 text-sm text-gray-400">{description}</p>
    </div>
  );
}
