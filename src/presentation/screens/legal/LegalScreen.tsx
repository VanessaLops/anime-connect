import Link from "next/link";
import type { ReactNode } from "react";
import { HOME_PATH } from "@/core/routes";
import HexFrame from "@/presentation/components/ui/HexFrame";
import SectionHeading from "@/presentation/components/ui/SectionHeading";
import Starfield from "@/presentation/components/ui/Starfield";
import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_COUNTERPART,
  type LegalDocument,
} from "@/presentation/screens/legal/content";

const STARFIELD_SEED = 21;
const CONTACT_SECTION_ID = "contato";

const LINK_STYLE =
  "text-hex-blue underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hex-blue";

interface LegalScreenProps {
  document: LegalDocument;
  /** Bloco de ação opcional exibido antes do texto (ex.: CTA de exclusão de conta). */
  children?: ReactNode;
}

/** Layout compartilhado da Política de Privacidade e dos Termos de Uso. */
export default function LegalScreen({ document, children }: LegalScreenProps) {
  const counterpart = LEGAL_COUNTERPART[document.path];

  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-gradient-to-b from-hex-panel/60 to-hex-navy px-6 pb-14 pt-10">
        <Starfield seed={STARFIELD_SEED} />
        <div className="relative mx-auto max-w-3xl">
          <Link
            href={HOME_PATH}
            className={`font-display text-xs font-bold uppercase tracking-[0.3em] ${LINK_STYLE}`}
          >
            ← Voltar à galáxia
          </Link>
          <div className="mt-12">
            <SectionHeading
              as="h1"
              eyebrow={document.eyebrow}
              title={document.title}
              subtitle={document.summary}
            />
          </div>
          <p className="mt-6 text-center text-xs uppercase tracking-[0.2em] text-hex-gold-light/60">
            Última atualização: {document.lastUpdated}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 pb-20">
        {children && <div className="mb-10">{children}</div>}
        <HexFrame as="article" highlight className="px-5 py-8 md:px-10 md:py-12">
          <nav aria-label="Sumário" className="border-b border-hex-gold-dark/40 pb-8">
            <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-hex-gold">
              Sumário
            </p>
            <ol className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              {document.sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className={LINK_STYLE}>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {document.sections.map((section) => (
            <section key={section.id} id={section.id} className="mt-10 scroll-mt-8">
              <h2 className="font-display text-lg font-bold uppercase tracking-wider text-hex-gold-light">
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-3 leading-relaxed text-hex-gold-light/80">
                  {paragraph}
                </p>
              ))}
              {section.items && (
                <ul className="mt-3 space-y-2 text-hex-gold-light/80">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed">
                      <span
                        className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-hex-gold"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section
            id={CONTACT_SECTION_ID}
            className="mt-12 scroll-mt-8 border-t border-hex-gold-dark/40 pt-8"
          >
            <h2 className="font-display text-lg font-bold uppercase tracking-wider text-hex-gold-light">
              Contato
            </h2>
            <p className="mt-3 leading-relaxed text-hex-gold-light/80">
              Dúvidas, pedidos sobre seus dados ou denúncias: escreva para{" "}
              <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} className={LINK_STYLE}>
                {LEGAL_CONTACT_EMAIL}
              </a>
              . Respondemos em até 15 dias.
            </p>
          </section>
        </HexFrame>

        <p className="mt-10 text-center text-sm text-hex-gold-light/60">
          Veja também:{" "}
          <Link href={counterpart.path} className={LINK_STYLE}>
            {counterpart.title}
          </Link>
        </p>
      </div>
    </main>
  );
}
