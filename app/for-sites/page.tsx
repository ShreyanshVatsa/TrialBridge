import type { Metadata } from "next";
import { ForSitesPage } from "@/components/pages/content-pages";

export const metadata: Metadata = { title: "For research sites" };

export default function Page() {
  return <ForSitesPage />;
}
