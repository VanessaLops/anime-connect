import type { Metadata } from "next";
import { PRIVACY_PATH } from "@/core/routes";
import LegalScreen from "@/presentation/screens/legal/LegalScreen";
import { PRIVACY_POLICY } from "@/presentation/screens/legal/content";

export const metadata: Metadata = {
  title: PRIVACY_POLICY.title,
  description: PRIVACY_POLICY.summary,
  alternates: { canonical: PRIVACY_PATH },
};

export default function PrivacyPage() {
  return <LegalScreen document={PRIVACY_POLICY} />;
}
