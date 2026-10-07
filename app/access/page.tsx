import type { Metadata } from "next";
import { AccessPage } from "@/components/access/access-page";

export const metadata: Metadata = { title: "Access Intelligence" };

export default function Page() {
  return <AccessPage />;
}
