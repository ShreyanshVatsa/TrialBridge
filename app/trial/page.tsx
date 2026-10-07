import type { Metadata } from "next";
import { Suspense } from "react";
import { TrialDetail, TrialLoading } from "@/components/trial/trial-detail";

export const metadata: Metadata = { title: "Trial details" };

/** One static page for every trial: the NCT ID comes from ?id= and data loads on the client. */
export default function TrialPage() {
  return (
    <Suspense fallback={<TrialLoading />}>
      <TrialDetail />
    </Suspense>
  );
}
