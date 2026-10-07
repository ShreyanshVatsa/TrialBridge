"use client";

import { useEffect, useState } from "react";
import { format, localeFor, useLanguage, useMessages } from "@/components/i18n";
import { formatDate, formatNumber } from "@/components/format";
import { Skeleton } from "@/components/site/skeleton";
import type { Meta } from "@/lib/types";

type State = { kind: "loading" } | { kind: "error" } | { kind: "ok"; meta: Meta };

/** Real numbers only, read from /data/meta.json produced by ingestion. */
export function LandingStat() {
  const m = useMessages();
  const locale = localeFor(useLanguage());
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    // Loaded after first paint so the data layer (and zod) stay out of the landing page's critical path.
    import("@/lib/data/loader")
      .then(({ loadMeta }) => loadMeta())
      .then((meta) => !cancelled && setState({ kind: "ok", meta }))
      .catch(() => !cancelled && setState({ kind: "error" }));
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.kind === "loading") {
    // Same footprint as the loaded numbers, so nothing shifts when they arrive.
    return (
      <div role="status">
        <span className="sr-only">{m.landing.statLoading}</span>
        <div className="grid gap-8 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i}>
              <Skeleton className="h-14 w-36 sm:h-[3.75rem]" />
              <Skeleton className="mt-3 h-6 w-64 max-w-full" />
            </div>
          ))}
        </div>
        <Skeleton className="mt-6 h-5 w-80 max-w-full" />
      </div>
    );
  }
  if (state.kind === "error") return <p className="text-muted-foreground">{m.landing.statError}</p>;

  const { meta } = state;
  return (
    <div>
      <dl className="grid gap-8 sm:grid-cols-2">
        <div className="flex flex-col-reverse">
          <dt className="mt-2 text-lg">{m.landing.statTrials}</dt>
          <dd className="font-heading text-5xl font-semibold tracking-tight text-primary sm:text-6xl">{formatNumber(meta.totalTrials, locale)}</dd>
        </div>
        <div className="flex flex-col-reverse">
          <dt className="mt-2 text-lg">{m.landing.statStates}</dt>
          <dd className="font-heading text-5xl font-semibold tracking-tight text-primary sm:text-6xl">{formatNumber(meta.statesCovered, locale)}</dd>
        </div>
      </dl>
      <p className="mt-6 text-sm text-muted-foreground">
        {format(m.landing.statDate, { date: formatDate(meta.dataDate, locale) })}
        {meta.source === "seed" && <> {m.landing.statSeed}</>}
      </p>
    </div>
  );
}
