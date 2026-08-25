import FeatureCard from "@/presentation/components/ui/FeatureCard";
import { FEATURES } from "@/presentation/screens/landing/content";

export default function Systems() {
  return (
    <section id="sistemas" className="border-t border-white/5 bg-black px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
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
