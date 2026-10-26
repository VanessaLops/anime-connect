import Link from "next/link";
import { PRIVACY_PATH, TERMS_PATH } from "@/core/routes";
import HexButton from "@/presentation/components/ui/HexButton";
import Ornament from "@/presentation/components/ui/Ornament";
import {
  APK_DOWNLOAD_LABEL,
  APK_DOWNLOAD_NOTE,
  APK_DOWNLOAD_URL,
} from "@/presentation/screens/landing/content";

const LEGAL_LINKS = [
  { href: PRIVACY_PATH, label: "Política de Privacidade" },
  { href: TERMS_PATH, label: "Termos de Uso" },
];

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
      <nav aria-label="Documentos legais" className="mt-8">
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.2em]">
          {LEGAL_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-hex-gold-light/60 underline-offset-4 hover:text-hex-gold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hex-blue"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
