import OpeningCrawl from "@/presentation/components/ui/OpeningCrawl";
import Starfield from "@/presentation/components/ui/Starfield";
import { CRAWL_LINES } from "@/presentation/screens/landing/content";

export default function CrawlSection() {
  return (
    <section className="relative bg-black">
      <Starfield />
      <OpeningCrawl episode="EPISÓDIO I" title="Uma Galáxia Conectada" lines={CRAWL_LINES} />
    </section>
  );
}
