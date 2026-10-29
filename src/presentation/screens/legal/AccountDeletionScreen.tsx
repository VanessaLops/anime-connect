import HexButton from "@/presentation/components/ui/HexButton";
import HexFrame from "@/presentation/components/ui/HexFrame";
import LegalScreen from "@/presentation/screens/legal/LegalScreen";
import {
  ACCOUNT_DELETION,
  ACCOUNT_DELETION_EMAIL_BODY,
  ACCOUNT_DELETION_EMAIL_SUBJECT,
  LEGAL_CONTACT_EMAIL,
} from "@/presentation/screens/legal/content";

// E-mail já preenchido com assunto e os campos que precisamos pra achar a conta.
const DELETION_MAILTO = `mailto:${LEGAL_CONTACT_EMAIL}?subject=${encodeURIComponent(
  ACCOUNT_DELETION_EMAIL_SUBJECT,
)}&body=${encodeURIComponent(ACCOUNT_DELETION_EMAIL_BODY)}`;

export default function AccountDeletionScreen() {
  return (
    <LegalScreen document={ACCOUNT_DELETION}>
      <HexFrame className="px-5 py-8 text-center md:px-10">
        <p className="font-display text-lg font-bold uppercase tracking-wider text-hex-gold-light">
          Solicitar exclusão
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-hex-gold-light/80">
          O botão abre seu app de e-mail com a mensagem pronta — só complete com o e-mail e o
          nome de usuário da conta.
        </p>
        <div className="mt-6">
          <HexButton href={DELETION_MAILTO}>Pedir exclusão da conta</HexButton>
        </div>
        <p className="mt-4 text-xs text-hex-gold-light/60">
          Ou escreva direto para {LEGAL_CONTACT_EMAIL}
        </p>
      </HexFrame>
    </LegalScreen>
  );
}
