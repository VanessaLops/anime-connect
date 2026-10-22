import PowerName from "@/presentation/components/powers/PowerName";
import HexFrame from "@/presentation/components/ui/HexFrame";
import RarityTag from "@/presentation/components/ui/RarityTag";
import type { PowerTeaser } from "@/presentation/screens/landing/content";

export default function PowerCard({ name, rarity, description, nameEffect }: PowerTeaser) {
  return (
    <HexFrame as="li" className="p-4 text-left">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-sm font-bold uppercase tracking-wide text-hex-gold-light">
          {nameEffect ? <PowerName name={name} effect={nameEffect} /> : name}
        </p>
        <RarityTag rarity={rarity} />
      </div>
      <p className="mt-2 text-sm text-hex-gold-light/60">{description}</p>
    </HexFrame>
  );
}
