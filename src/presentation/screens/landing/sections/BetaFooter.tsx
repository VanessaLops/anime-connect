import HexButton from "@/presentation/components/ui/HexButton";
import Ornament from "@/presentation/components/ui/Ornament";
import {
  APK_DOWNLOAD_LABEL,
  APK_DOWNLOAD_NOTE,
  APK_DOWNLOAD_URL,
} from "@/presentation/screens/landing/content";

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
      <div className="mt-8">
        <HexButton href={APK_DOWNLOAD_URL}>{APK_DOWNLOAD_LABEL}</HexButton>
        <p className="mt-3 text-xs text-hex-gold-light/50">{APK_DOWNLOAD_NOTE}</p>
      </div>
      <p className="mx-auto mt-5 max-w-md text-xs leading-relaxed text-hex-gold-light/50">
        v3 é a versão da arquitetura deste site — o aplicativo em si ainda está em
        desenvolvimento, rumo à sua v1. Episódio IV chega quando a frota decolar.
      </p>
    </footer>
  );
}
