import AngelWings from "@/presentation/components/powers/AngelWings";
import { variantsOf } from "@/presentation/components/powers/angelVariants";
import HexFrame from "@/presentation/components/ui/HexFrame";
import RarityTag from "@/presentation/components/ui/RarityTag";
import type { AngelDevilPower, PowerAccent } from "@/presentation/screens/landing/content";

// Tamanho do mascote (px) no destaque e nas miniaturas da galeria.
const SHOWCASE_SIZE = 56;
const THUMB_SIZE = 18;

const ACCENT_STYLES: Record<PowerAccent, { text: string; glow: string }> = {
  gold: { text: "text-hex-gold", glow: "from-hex-gold/20" },
  pink: { text: "text-anime-pink", glow: "from-anime-pink/20" },
};

export default function PowerSideCard({
  family,
  name,
  tagline,
  description,
  rarity,
  price,
  showcase,
  accent,
}: AngelDevilPower) {
  const styles = ACCENT_STYLES[accent];
  const models = variantsOf(family);

  return (
    <HexFrame as="article" className="text-left">
      <div className={`flex justify-center bg-gradient-to-b ${styles.glow} to-transparent pb-2 pt-6`}>
        <AngelWings variant={showcase} size={SHOWCASE_SIZE} />
      </div>

      <div className="p-6 pt-2">
        <div className="flex items-center justify-between gap-3">
          <h4 className={`font-display text-2xl font-bold uppercase tracking-wide ${styles.text}`}>
            {name}
          </h4>
          <RarityTag rarity={rarity} />
        </div>
        <p className={`mt-1 font-display text-xs uppercase tracking-[0.2em] ${styles.text}`}>
          {tagline}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-hex-gold-light/60">{description}</p>

        <ul
          className="mt-5 grid grid-cols-5 gap-y-2 border-t border-hex-gold-dark/40 pt-4"
          aria-label={`Os ${models.length} modelos do pacote ${name}`}
        >
          {models.map((model) => (
            <li key={model.id} className="flex justify-center" title={model.label}>
              <AngelWings variant={model.id} size={THUMB_SIZE} still />
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs text-hex-gold-light/50">
          {price} moedas · {models.length} modelos no pacote
        </p>
      </div>
    </HexFrame>
  );
}
