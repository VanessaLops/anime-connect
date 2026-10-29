import type { Metadata } from "next";
import { ACCOUNT_DELETION_PATH } from "@/core/routes";
import AccountDeletionScreen from "@/presentation/screens/legal/AccountDeletionScreen";
import { ACCOUNT_DELETION } from "@/presentation/screens/legal/content";

export const metadata: Metadata = {
  title: ACCOUNT_DELETION.title,
  description: ACCOUNT_DELETION.summary,
  alternates: { canonical: ACCOUNT_DELETION_PATH },
};

export default function AccountDeletionPage() {
  return <AccountDeletionScreen />;
}
