import type { Metadata } from "next";
import { PolicyPage } from "@/components/pages/content-pages";

export const metadata: Metadata = { title: "Privacy policy (draft)" };

export default function Page() {
  return <PolicyPage kind="privacyPolicy" />;
}
