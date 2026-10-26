import Ornament from "@/presentation/components/ui/Ornament";

type HeadingElement = "h1" | "h2";

interface SectionHeadingProps {
  /** h1 quando o heading é o título da página (ex.: páginas legais). */
  as?: HeadingElement;
  /** Linha pequena acima do título, ex.: "Episódio II". */
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeading({
  as: Heading = "h2",
  eyebrow,
  title,
  subtitle,
}: SectionHeadingProps) {
  return (
    <header className="text-center">
      <p className="font-display text-xs font-bold uppercase tracking-[0.4em] text-hex-blue">
        {eyebrow}
      </p>
      <Heading className="mt-3 font-display text-3xl font-bold uppercase tracking-wider text-hex-gold-light md:text-5xl">
        {title}
      </Heading>
      <Ornament className="mt-5" />
      {subtitle && <p className="mx-auto mt-5 max-w-xl text-hex-gold-light/60">{subtitle}</p>}
    </header>
  );
}
