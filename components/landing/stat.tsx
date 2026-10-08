"use client";

import { useEffect, useRef, useState } from "react";
import { format, localeFor, useLanguage, useMessages } from "@/components/i18n";
import { formatDate, formatNumber } from "@/components/format";
import { Skeleton } from "@/components/site/skeleton";
import type { Meta } from "@/lib/types";
import { useReducedMotion } from "./motion";

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
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-12">
          {[0, 1].map((i) => (
            <div key={i}>
              <Skeleton className="h-[clamp(3.7rem,10.7vw,8.6rem)] w-[min(18rem,70%)] bg-current/10" />
              <Skeleton className="mt-3 h-6 w-64 max-w-full bg-current/10" />
            </div>
          ))}
        </div>
        <Skeleton className="mt-10 h-5 w-80 max-w-full bg-current/10" />
      </div>
    );
  }
  if (state.kind === "error") return <p className="text-muted-foreground">{m.landing.statError}</p>;

  const { meta } = state;
  return (
    <div>
      <dl className="grid gap-10 sm:grid-cols-2 sm:gap-12">
        <div className="flex flex-col-reverse">
          <dt className="mt-3 max-w-[30ch] text-lg">{m.landing.statTrials}</dt>
          <dd className="font-heading text-[clamp(4.5rem,13vw,10.5rem)] leading-[0.82] font-extrabold tracking-[-0.03em] text-lavender tabular-nums [font-stretch:58%]">
            <CountUp value={meta.totalTrials} locale={locale} />
          </dd>
        </div>
        <div className="flex flex-col-reverse">
          <dt className="mt-3 max-w-[30ch] text-lg">{m.landing.statStates}</dt>
          <dd className="font-heading text-[clamp(4.5rem,13vw,10.5rem)] leading-[0.82] font-extrabold tracking-[-0.03em] text-lavender tabular-nums [font-stretch:58%]">
            <CountUp value={meta.statesCovered} locale={locale} />
          </dd>
        </div>
      </dl>
      <p className="mt-10 text-sm opacity-75">
        {format(m.landing.statDate, { date: formatDate(meta.dataDate, locale) })}
        {meta.source === "seed" && <> {m.landing.statSeed}</>}
      </p>
    </div>
  );
}

/** Counts up to the real value the first time it scrolls into view. The final number is what screen readers get. */
function CountUp({ value, locale }: { value: number; locale: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [shown, setShown] = useState<number | null>(reduced ? null : 0);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / 1400);
          setShown(Math.round(value * (1 - Math.pow(1 - p, 4))));
          frame = p < 1 ? requestAnimationFrame(tick) : 0;
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, reduced]);

  return (
    <span ref={ref}>
      <span aria-hidden>{formatNumber(shown ?? value, locale)}</span>
      <span className="sr-only">{formatNumber(value, locale)}</span>
    </span>
  );
}
