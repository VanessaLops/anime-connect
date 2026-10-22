import HexFrame from "@/presentation/components/ui/HexFrame";
import OpeningCrawl from "@/presentation/components/ui/OpeningCrawl";
import Starfield from "@/presentation/components/ui/Starfield";
import { CRAWL_LINES } from "@/presentation/screens/landing/content";

const STARFIELD_SEED = 21;

// Crawl numa "tela de cinema" emoldurada, logo depois do splash.
export default function CrawlSection() {
  return (
    <section id="abertura" className="relative bg-hex-navy px-4 py-20 md:px-6">
      <div className="relative mx-auto max-w-5xl">
        <p className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap border border-hex-gold/70 bg-hex-navy px-4 py-1 font-display text-[10px] font-bold uppercase tracking-[0.35em] text-hex-gold md:text-xs">
          Transmissão da frota
        </p>
        <HexFrame highlight>
          <div className="relative overflow-hidden bg-black">
            <Starfield seed={STARFIELD_SEED} />
            <OpeningCrawl episode="Episódio I" title="Uma Galáxia Conectada" lines={CRAWL_LINES} />
          </div>
        </HexFrame>
      </div>
    </section>
  );
}
