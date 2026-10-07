"use client";

import { useEffect, useState } from "react";
import { format, useMessages } from "@/components/i18n";
import { formatDate, formatNumber } from "@/components/format";
import { loadMeta } from "@/lib/data/loader";
import type { Meta } from "@/lib/types";

type State = { kind: "loading" } | { kind: "error" } | { kind: "ok"; meta: Meta };

/** Real numbers only, read from /data/meta.json produced by ingestion. */
export function LandingStat() {
  const m = useMessages();
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    loadMeta()
      .then((meta) => !cancelled && setState({ kind: "ok", meta }))
      .catch(() => !cancelled && setState({ kind: "error" }));
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.kind === "loading") {
    return (
      <p role="status" className="text-muted-foreground">
        {m.landing.statLoading}
      </p>
    );
  }
  if (state.kind === "error") return <p className="text-muted-foreground">{m.landing.statError}</p>;

  const { meta } = state;
  return (
    <div>
      <dl className="grid gap-8 sm:grid-cols-2">
        <div className="flex flex-col-reverse">
          <dt className="mt-2 text-lg">{m.landing.statTrials}</dt>
          <dd className="font-heading text-5xl font-semibold tracking-tight text-primary sm:text-6xl">{formatNumber(meta.totalTrials)}</dd>
        </div>
        <div className="flex flex-col-reverse">
          <dt className="mt-2 text-lg">{m.landing.statStates}</dt>
          <dd className="font-heading text-5xl font-semibold tracking-tight text-primary sm:text-6xl">{formatNumber(meta.statesCovered)}</dd>
        </div>
      </dl>
      <p className="mt-6 text-sm text-muted-foreground">
        {format(m.landing.statDate, { date: formatDate(meta.dataDate) })}
        {meta.source === "seed" && <> {m.landing.statSeed}</>}
      </p>
    </div>
  );
}
