import type { Metadata } from "next";
import { TERMS_PATH } from "@/core/routes";
import LegalScreen from "@/presentation/screens/legal/LegalScreen";
import { TERMS_OF_USE } from "@/presentation/screens/legal/content";

export const metadata: Metadata = {
  title: TERMS_OF_USE.title,
  description: TERMS_OF_USE.summary,
  alternates: { canonical: TERMS_PATH },
};

export default function TermsPage() {
  return <LegalScreen document={TERMS_OF_USE} />;
}
