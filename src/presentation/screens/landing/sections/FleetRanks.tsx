import RankBadge from "@/presentation/components/ui/RankBadge";
import { FLEET_RANKS } from "@/presentation/screens/landing/content";

export default function FleetRanks() {
  return (
    <section className="border-t border-white/5 bg-gradient-to-b from-black to-[#0a0a12] px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
          Patentes da Frota
        </h2>
        <p className="mt-3 text-gray-400">
          Uma prévia da jornada — o sistema completo de níveis chega na v1.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {FLEET_RANKS.map((rank, i) => (
            <RankBadge key={rank} label={rank} active={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
