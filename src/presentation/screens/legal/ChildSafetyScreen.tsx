import HexButton from "@/presentation/components/ui/HexButton";
import HexFrame from "@/presentation/components/ui/HexFrame";
import LegalScreen, { LEGAL_LINK_STYLE } from "@/presentation/screens/legal/LegalScreen";
import {
  CHILD_SAFETY,
  CHILD_SAFETY_EXTERNAL_CHANNELS,
  CHILD_SAFETY_REPORT_SUBJECT,
  LEGAL_CONTACT_EMAIL,
} from "@/presentation/screens/legal/content";

const REPORT_MAILTO = `mailto:${LEGAL_CONTACT_EMAIL}?subject=${encodeURIComponent(
  CHILD_SAFETY_REPORT_SUBJECT,
)}`;

// Site externo abre em nova aba; `tel:` não precisa.
const NEW_TAB_PROPS = { target: "_blank", rel: "noopener noreferrer" } as const;

function isWebLink(href: string) {
  return href.startsWith("http");
}

export default function ChildSafetyScreen() {
  return (
    <LegalScreen document={CHILD_SAFETY}>
      <HexFrame className="px-5 py-8 md:px-10">
        <div className="text-center">
          <p className="font-display text-lg font-bold uppercase tracking-wider text-hex-gold-light">
            Denunciar
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-hex-gold-light/80">
            Criança em perigo imediato? Ligue 190. Para denunciar conteúdo ou contas do
            AnimeConnect, fale direto com a nossa equipe de segurança.
          </p>
          <div className="mt-6">
            <HexButton href={REPORT_MAILTO}>Denunciar à equipe</HexButton>
          </div>
        </div>

        <ul className="mt-8 grid gap-4 border-t border-hex-gold-dark/40 pt-6 text-sm md:grid-cols-3">
          {CHILD_SAFETY_EXTERNAL_CHANNELS.map((channel) => (
            <li key={channel.name}>
              <p className="font-display font-bold uppercase tracking-wider text-hex-gold">
                {channel.name}
              </p>
              <p className="mt-1 leading-relaxed text-hex-gold-light/70">{channel.description}</p>
              <a
                href={channel.href}
                {...(isWebLink(channel.href) ? NEW_TAB_PROPS : {})}
                className={`mt-2 inline-block ${LEGAL_LINK_STYLE}`}
              >
                {channel.linkLabel}
              </a>
            </li>
          ))}
        </ul>
      </HexFrame>
    </LegalScreen>
  );
}
