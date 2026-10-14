"use client";

import { useSession } from "@/components/session/session-provider";
import { TrialDetail } from "./trial-detail";

/** TrialDetail with the current search's per-criterion match (v6 step 5) looked up from the session. */
export function SessionTrialDetail() {
  const { session } = useSession();
  const byTrial = session?.criteria?.byTrial;
  return <TrialDetail getMatch={(nctId) => byTrial?.[nctId]} />;
}
