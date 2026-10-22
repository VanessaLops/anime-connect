import FeatureCard from "@/presentation/components/ui/FeatureCard";
import SectionHeading from "@/presentation/components/ui/SectionHeading";
import Starfield from "@/presentation/components/ui/Starfield";
import { FEATURES } from "@/presentation/screens/landing/content";

const STARFIELD_SEED = 7;

export default function Systems() {
  return (
    <section
      id="sistemas"
      className="relative overflow-hidden bg-gradient-to-b from-hex-navy via-hex-panel/60 to-hex-navy px-6 py-24"
    >
      <Starfield seed={STARFIELD_SEED} />
      <div className="relative mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Episódio II"
          title="Sistemas da Nave"
          subtitle="O que já está no radar pra quando a frota decolar."
        />
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </ul>
      </div>
    </section>
  );
}
