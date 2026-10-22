import Planet from "@/presentation/components/ui/Planet";
import PowerCard from "@/presentation/components/ui/PowerCard";
import PowerSideCard from "@/presentation/components/ui/PowerSideCard";
import RankBadge from "@/presentation/components/ui/RankBadge";
import SectionHeading from "@/presentation/components/ui/SectionHeading";
import Starfield from "@/presentation/components/ui/Starfield";
import {
  ANGEL_DEVIL_POWERS,
  FLEET_RANKS,
  POWER_TEASERS,
} from "@/presentation/screens/landing/content";

const STARFIELD_SEED = 99;

export default function FleetRanks() {
  return (
    <section
      id="patentes"
      className="relative overflow-hidden bg-gradient-to-b from-hex-navy to-hex-panel px-6 py-24"
    >
      <Starfield seed={STARFIELD_SEED} />

      {/* os dois lados da galáxia, um planeta de cada cor nas bordas */}
      <div aria-hidden="true" className="absolute -left-24 top-[46%] w-56 opacity-50 md:-left-16 md:w-80">
        <Planet tone="gold" />
      </div>
      <div aria-hidden="true" className="absolute -right-24 top-[52%] w-56 opacity-50 md:-right-16 md:w-80">
        <Planet tone="crimson" ring />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <SectionHeading
          eyebrow="Episódio III"
          title="Patentes da Frota"
          subtitle="Uma prévia da jornada — o sistema completo de níveis chega na v1."
        />

        <div className="relative mt-14">
          {/* trilho que liga as patentes, atrás dos emblemas */}
          <span
            aria-hidden="true"
            className="absolute inset-x-12 top-6 hidden h-px bg-gradient-to-r from-hex-gold via-hex-gold-dark to-hex-gold-dark/20 md:block"
          />
          <ol className="relative flex flex-wrap justify-center gap-x-4 gap-y-8 md:justify-between">
            {FLEET_RANKS.map((rank, i) => (
              <RankBadge key={rank} label={rank} tier={i + 1} active={i === 0} />
            ))}
          </ol>
        </div>

        <h3 className="mt-24 font-display text-2xl font-bold uppercase tracking-wider text-hex-gold-light md:text-3xl">
          Escolha seu lado da galáxia
        </h3>
        <p className="mx-auto mt-3 max-w-md text-hex-gold-light/60">
          Os dois powers mais cobiçados da loja, no beta desde já — mesmo slot, então só um dos
          dois fica equipado por vez.
        </p>
        <div className="mx-auto mt-10 grid gap-6 sm:grid-cols-2">
          {ANGEL_DEVIL_POWERS.map((power) => (
            <PowerSideCard key={power.name} {...power} />
          ))}
        </div>

        <p className="mx-auto mt-16 max-w-md text-sm text-hex-gold-light/50">
          + mais 24 powers pra desbloquear na loja — uma amostra do que já espreita no radar:
        </p>
        <ul className="mx-auto mt-6 grid max-w-2xl gap-4 sm:grid-cols-2">
          {POWER_TEASERS.map((power) => (
            <PowerCard key={power.name} {...power} />
          ))}
        </ul>
      </div>
    </section>
  );
}
