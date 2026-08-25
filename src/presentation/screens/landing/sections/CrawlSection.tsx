import OpeningCrawl from "@/presentation/components/ui/OpeningCrawl";
import Starfield from "@/presentation/components/ui/Starfield";
import { CRAWL_LINES } from "@/presentation/screens/landing/content";

const STARFIELD_SEED = 21;

export default function CrawlSection() {
  return (
    <section className="relative bg-black">
      <Starfield seed={STARFIELD_SEED} />
      <OpeningCrawl episode="EPISÓDIO I" title="Uma Galáxia Conectada" lines={CRAWL_LINES} />
    </section>
  );
}
