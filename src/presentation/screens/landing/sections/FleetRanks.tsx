import EpisodeTag from "@/presentation/components/ui/EpisodeTag";
import PowerCard from "@/presentation/components/ui/PowerCard";
import PowerSideCard from "@/presentation/components/ui/PowerSideCard";
import RankBadge from "@/presentation/components/ui/RankBadge";
import Starfield from "@/presentation/components/ui/Starfield";
import {
  ANGEL_DEVIL_POWERS,
  FLEET_RANKS,
  POWER_TEASERS,
} from "@/presentation/screens/landing/content";

const STARFIELD_SEED = 99;

export default function FleetRanks() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-gradient-to-b from-black to-[#0a0a12] px-6 py-24">
      <Starfield seed={STARFIELD_SEED} />
      <div className="relative mx-auto max-w-4xl text-center">
        <EpisodeTag>EPISÓDIO III</EpisodeTag>
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

        <h3 className="mt-16 font-display text-xl font-bold uppercase tracking-wide text-white md:text-2xl">
          Escolha seu lado da galáxia
        </h3>
        <p className="mx-auto mt-2 max-w-md text-gray-400">
          Os dois powers mais cobiçados da loja, no beta desde já — mesmo slot, então só um dos
          dois fica equipado por vez.
        </p>
        <div className="mx-auto mt-8 grid gap-6 sm:grid-cols-2">
          {ANGEL_DEVIL_POWERS.map((power) => (
            <PowerSideCard key={power.name} {...power} />
          ))}
        </div>

        <p className="mx-auto mt-16 max-w-md text-sm text-gray-500">
          + mais 24 powers pra desbloquear na loja — uma amostra do que já espreita no radar:
        </p>
        <div className="mx-auto mt-4 grid max-w-2xl gap-4 sm:grid-cols-2">
          {POWER_TEASERS.map((power) => (
            <PowerCard key={power.name} {...power} />
          ))}
        </div>
      </div>
    </section>
  );
}
