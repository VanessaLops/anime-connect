import EpisodeTag from "@/presentation/components/ui/EpisodeTag";
import FeatureCard from "@/presentation/components/ui/FeatureCard";
import Starfield from "@/presentation/components/ui/Starfield";
import { FEATURES } from "@/presentation/screens/landing/content";

const STARFIELD_SEED = 7;

export default function Systems() {
  return (
    <section
      id="sistemas"
      className="relative overflow-hidden border-t border-white/5 bg-black px-6 py-24"
    >
      <Starfield seed={STARFIELD_SEED} />
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <EpisodeTag>EPISÓDIO II</EpisodeTag>
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            Sistemas da Nave
          </h2>
          <p className="mt-3 text-gray-400">O que já está no radar pra quando a frota decolar.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
