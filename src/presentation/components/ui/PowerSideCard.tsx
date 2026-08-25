import type { PowerAccent } from "@/presentation/screens/landing/content";

interface PowerSideCardProps {
  emoji: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  models: string[];
  accent: PowerAccent;
}

const ACCENT_STYLES: Record<PowerAccent, { border: string; text: string; chip: string }> = {
  gold: {
    border: "border-holo-gold/30 hover:border-holo-gold/60",
    text: "text-holo-gold",
    chip: "border-holo-gold/30 bg-holo-gold/10 text-holo-gold",
  },
  pink: {
    border: "border-anime-pink/30 hover:border-anime-pink/60",
    text: "text-anime-pink",
    chip: "border-anime-pink/30 bg-anime-pink/10 text-anime-pink",
  },
};

export default function PowerSideCard({
  emoji,
  name,
  tagline,
  description,
  price,
  models,
  accent,
}: PowerSideCardProps) {
  const styles = ACCENT_STYLES[accent];
  return (
    <div
      className={`rounded-2xl border bg-white/5 p-6 text-left backdrop-blur transition ${styles.border}`}
    >
      <span className="text-4xl" aria-hidden="true">
        {emoji}
      </span>
      <h4 className={`mt-3 font-display text-2xl font-bold uppercase tracking-wide ${styles.text}`}>
        {name}
      </h4>
      <p className={`mt-1 font-display text-xs uppercase tracking-[0.2em] ${styles.text}`}>
        {tagline}
      </p>
      <p className="mt-3 text-sm text-gray-400">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {models.map((model) => (
          <span key={model} className={`rounded-full border px-3 py-1 text-xs ${styles.chip}`}>
            {model}
          </span>
        ))}
      </div>
      <p className="mt-4 text-xs text-gray-500">épico · {price} moedas · 10 modelos no pacote</p>
    </div>
  );
}
