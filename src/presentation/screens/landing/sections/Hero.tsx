import type { CSSProperties } from "react";
import HexButton from "@/presentation/components/ui/HexButton";
import Ornament from "@/presentation/components/ui/Ornament";
import Planet from "@/presentation/components/ui/Planet";
import Starfield from "@/presentation/components/ui/Starfield";
import {
  APK_DOWNLOAD_LABEL,
  APK_DOWNLOAD_NOTE,
  APK_DOWNLOAD_URL,
} from "@/presentation/screens/landing/content";

// Linha do tempo da abertura (ms): a frase azul acende, o logo entra
// enquanto ela recua, e o resto sobe depois do logo assentar.
const LOGO_DELAY_MS = 1400;
const TAGLINE_DELAY_MS = 2600;
const ACTIONS_DELAY_MS = 2900;

const delay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

/**
 * Primeira tela: abertura de space opera ("Há muito tempo…") com logo
 * dourado e um planeta nascendo no horizonte, no clima de splash de jogo.
 */
export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-hex-navy px-6 pb-32 pt-24 text-center">
      {/* nebulosas */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-1/4 -top-1/4 h-[80vh] w-[80vw] animate-nebula-drift rounded-full bg-[radial-gradient(circle,rgba(10,200,185,0.16),transparent_62%)] blur-3xl" />
        <div
          className="absolute -right-1/4 top-0 h-[70vh] w-[70vw] animate-nebula-drift rounded-full bg-[radial-gradient(circle,rgba(121,40,202,0.22),transparent_62%)] blur-3xl"
          style={{ animationDirection: "reverse" }}
        />
      </div>
      <Starfield />

      {/* lua dourada e planeta com anel de fundo */}
      <div aria-hidden="true" className="absolute left-[4%] top-[5%] w-12 opacity-80 md:left-[6%] md:top-[12%] md:w-24">
        <Planet tone="gold" />
      </div>
      <div aria-hidden="true" className="absolute right-[6%] top-[4%] w-20 opacity-70 md:right-[8%] md:top-[6%] md:w-36">
        <Planet tone="violet" ring />
      </div>

      {/* planeta do horizonte, maior que a tela, só o topo aparece */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[74%] w-[220vw] -translate-x-1/2 md:top-[66%] md:w-[130vw]"
      >
        <div className="animate-planet-rise">
          <Planet tone="abyss" />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-hex-navy to-transparent"
      />

      <div className="relative z-10 flex flex-col items-center">
        <p className="animate-intro text-base text-sw-blue md:text-xl">
          Há muito tempo, numa galáxia não tão distante…
        </p>

        <h1
          className="mt-8 animate-logo-in bg-gradient-to-b from-hex-gold-light via-hex-gold to-hex-gold-dark bg-clip-text font-display text-5xl font-black uppercase leading-none tracking-wider text-transparent drop-shadow-[0_4px_24px_rgba(200,170,110,0.35)] sm:text-6xl md:text-8xl"
          style={delay(LOGO_DELAY_MS)}
        >
          Anime
          <br className="sm:hidden" />
          Connect
        </h1>

        <div className="animate-fade-up" style={delay(TAGLINE_DELAY_MS)}>
          <Ornament className="mt-6" />
          <p className="mt-4 font-display text-xs font-bold uppercase tracking-[0.5em] text-hex-blue md:text-sm">
            Beta Galaxy
          </p>
          <p className="mx-auto mt-6 max-w-xl text-balance text-base text-hex-gold-light/75 md:text-lg">
            Cada fã já foi uma estrela sozinha num feed qualquer. AnimeConnect é a constelação
            que está se formando pra juntar todas elas — em construção rumo à v1.
          </p>
        </div>

        <div className="mt-10 flex animate-fade-up flex-col items-center" style={delay(ACTIONS_DELAY_MS)}>
          <div className="flex flex-col gap-4 sm:flex-row">
            <HexButton href={APK_DOWNLOAD_URL}>{APK_DOWNLOAD_LABEL}</HexButton>
            <HexButton href="#abertura" variant="ghost">
              Ver a abertura
            </HexButton>
          </div>
          <p className="mt-4 text-xs text-hex-gold-light/50">{APK_DOWNLOAD_NOTE}</p>
        </div>
      </div>
    </section>
  );
}
