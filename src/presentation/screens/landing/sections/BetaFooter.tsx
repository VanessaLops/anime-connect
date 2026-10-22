import Ornament from "@/presentation/components/ui/Ornament";

export default function BetaFooter() {
  return (
    <footer className="border-t border-hex-gold-dark/40 bg-hex-navy px-6 py-14 text-center">
      <p className="font-display text-xs font-bold uppercase tracking-[0.4em] text-sw-blue">
        Continua…
      </p>
      <p className="mt-4 font-display text-2xl font-black uppercase tracking-wider text-hex-gold">
        AnimeConnect
      </p>
      <Ornament className="mt-4" />
      <p className="mx-auto mt-5 max-w-md text-xs leading-relaxed text-hex-gold-light/50">
        v3 é a versão da arquitetura deste site — o aplicativo em si ainda está em
        desenvolvimento, rumo à sua v1. Episódio IV chega quando a frota decolar.
      </p>
    </footer>
  );
}
