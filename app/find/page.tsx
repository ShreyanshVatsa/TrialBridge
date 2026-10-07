import type { Metadata } from "next";
import { FindFlow } from "@/components/find/find-flow";
import { en } from "@/components/i18n/en";

export const metadata: Metadata = { title: en.chat.title };

export default function FindPage() {
  return <FindFlow />;
}
