import type { Metadata } from "next";
import { PolicyPage } from "@/components/pages/content-pages";

export const metadata: Metadata = { title: "Terms of use (draft)" };

export default function Page() {
  return <PolicyPage kind="terms" />;
}
