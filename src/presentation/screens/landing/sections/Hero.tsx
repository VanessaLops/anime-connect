import Starfield from "@/presentation/components/ui/Starfield";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="absolute inset-0 bg-hero-glow opacity-20 blur-[120px]" />
      <Starfield />

      <span
        className="relative mb-6 inline-flex animate-fade-up items-center gap-2 rounded-full border border-holo-gold/30 bg-holo-gold/10 px-4 py-1 font-display text-xs tracking-[0.2em] text-holo-gold"
        style={{ animationDelay: "0ms" }}
      >
        BETA GALAXY
      </span>

      <h1
        className="relative animate-fade-up bg-gradient-to-b from-holo-gold to-anime-purple bg-clip-text font-display text-5xl font-black uppercase tracking-widest text-transparent md:text-7xl"
        style={{ animationDelay: "150ms" }}
      >
        AnimeConnect
      </h1>
      <p
        className="relative mt-6 max-w-xl animate-fade-up text-balance text-lg text-gray-300"
        style={{ animationDelay: "300ms" }}
      >
        Cada fã já foi uma estrela sozinha num feed qualquer. AnimeConnect é a constelação que
        está se formando pra juntar todas elas — em construção rumo à v1.
      </p>

      <a
        href="#sistemas"
        className="relative mt-10 animate-fade-up rounded-full bg-anime-cyan/10 px-8 py-3 font-display text-sm font-bold tracking-wide text-anime-cyan ring-1 ring-anime-cyan/40 transition hover:bg-anime-cyan/20"
        style={{ animationDelay: "450ms" }}
      >
        Junte-se à frota
      </a>

      <div className="absolute bottom-8 animate-bounce text-gray-500" aria-hidden="true">
        ▾
      </div>
    </section>
  );
}
