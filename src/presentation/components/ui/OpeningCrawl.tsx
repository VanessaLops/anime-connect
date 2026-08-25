interface OpeningCrawlProps {
  episode?: string;
  title: string;
  lines: string[];
}

// Texto que sobe em perspectiva e "some" no fundo, tipo abertura de space
// opera. Genérico de propósito — quem chama passa o conteúdo.
export default function OpeningCrawl({ episode, title, lines }: OpeningCrawlProps) {
  return (
    <div className="relative h-[70vh] overflow-hidden [perspective:350px]">
      <div className="absolute inset-x-0 bottom-0 origin-bottom animate-crawl text-center [transform-style:preserve-3d]">
        {episode && (
          <p className="mb-4 font-display text-sm tracking-[0.3em] text-holo-gold">
            {episode}
          </p>
        )}
        <h2 className="mb-8 font-display text-3xl font-bold uppercase tracking-wide text-holo-gold md:text-5xl">
          {title}
        </h2>
        <div className="mx-auto max-w-2xl space-y-6 px-6 font-display text-lg leading-relaxed text-holo-gold md:text-2xl">
          {lines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
