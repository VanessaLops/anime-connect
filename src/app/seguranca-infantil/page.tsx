import type { Metadata } from "next";
import { CHILD_SAFETY_PATH } from "@/core/routes";
import ChildSafetyScreen from "@/presentation/screens/legal/ChildSafetyScreen";
import { CHILD_SAFETY } from "@/presentation/screens/legal/content";

export const metadata: Metadata = {
  title: CHILD_SAFETY.title,
  description: CHILD_SAFETY.summary,
  alternates: { canonical: CHILD_SAFETY_PATH },
};

export default function ChildSafetyPage() {
  return <ChildSafetyScreen />;
}
