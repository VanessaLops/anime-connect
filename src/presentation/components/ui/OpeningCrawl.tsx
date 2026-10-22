interface OpeningCrawlProps {
  episode?: string;
  title: string;
  lines: string[];
}

// O texto some no fundo: a parte de cima do palco é transparente.
const DISTANCE_FADE = "[mask-image:linear-gradient(to_bottom,transparent_0%,black_45%)]";

// Texto que sobe em perspectiva e "some" no fundo, tipo abertura de space
// opera. Genérico de propósito — quem chama passa o conteúdo. Com
// reduced-motion vira texto parado e legível.
export default function OpeningCrawl({ episode, title, lines }: OpeningCrawlProps) {
  return (
    <div
      className={`relative h-[min(70vh,640px)] overflow-hidden [perspective:420px] motion-reduce:h-auto motion-reduce:[mask-image:none] motion-reduce:[perspective:none] ${DISTANCE_FADE}`}
    >
      <div className="absolute inset-x-0 top-full mx-auto max-w-2xl origin-[50%_0%] animate-crawl px-6 text-center text-holo-gold motion-reduce:static motion-reduce:animate-none motion-reduce:py-12">
        {episode && (
          <p className="font-display text-sm font-bold uppercase tracking-[0.3em] md:text-lg">
            {episode}
          </p>
        )}
        <h3 className="mb-10 mt-2 font-display text-3xl font-black uppercase tracking-wide md:text-6xl">
          {title}
        </h3>
        <div className="space-y-8 text-justify text-xl font-semibold leading-relaxed md:text-3xl [hyphens:auto]">
          {lines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
