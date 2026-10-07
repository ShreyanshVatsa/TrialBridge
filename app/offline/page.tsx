import type { Metadata } from "next";
import { OfflinePage } from "@/components/pages/offline";

export const metadata: Metadata = { title: "Offline", robots: { index: false } };

export default function Page() {
  return <OfflinePage />;
}
