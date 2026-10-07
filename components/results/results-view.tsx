"use client";

import { Info, Pencil, Printer, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { format, useMessages } from "@/components/i18n";
import { formatDate, formatNumber } from "@/components/format";
import type { SearchSession } from "@/components/session/session-provider";
import { Disclaimer } from "@/components/site/disclaimer";
import { TypingDots } from "@/components/site/spinner";
import { Button } from "@/components/ui/button";
import type { SearchProgress } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ResultCard } from "./result-card";

const INITIAL_VISIBLE = 10;

function Notice({ children, tone = "info", icon }: { children: ReactNode; tone?: "info" | "warn"; icon?: ReactNode }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3",
        tone === "warn" ? "border-warn-border bg-warn text-warn-foreground" : "border-border bg-secondary/60 text-foreground",
      )}
    >
      {icon ?? <Info className="mt-1 size-4 shrink-0" aria-hidden />}
      <div>{children}</div>
    </div>
  );
}

export function SearchProgressView({ progress }: { progress: SearchProgress }) {
  const m = useMessages();
  const pct = progress.fraction === undefined ? null : Math.round(Math.min(1, Math.max(0, progress.fraction)) * 100);
  return (
    <div role="status" className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-6 text-center">
      <TypingDots label="" className="text-primary" />
      <p className="mt-3 text-lg font-medium">{m.search.stage[progress.stage]}</p>
      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label={m.search.progressLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct ?? undefined}
      >
        <div
          className={cn("h-full rounded-full bg-primary transition-[width] duration-300", pct === null && "w-1/3 animate-pulse")}
          style={pct === null ? undefined : { width: `${pct}%` }}
        />
      </div>
      {pct !== null && <p className="mt-2 text-sm text-muted-foreground">{format(m.search.percent, { pct })}</p>}
    </div>
  );
}

export function ResultsView({
  session,
  onEdit,
  onNewSearch,
  onWiden,
}: {
  session: SearchSession;
  onEdit: () => void;
  onNewSearch: () => void;
  onWiden: () => void;
}) {
  const m = useMessages();
  const [visible, setVisible] = useState(INITIAL_VISIBLE);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), [session.searchedAt]);

  const { results, outcome, analysis } = session;
  const shown = results.slice(0, visible);
  const today = formatDate(new Date(session.searchedAt).toISOString());

  return (
    <div className="space-y-6">
      <div className="print-only">
        <h1 className="text-3xl font-semibold">{m.results.printTitle}</h1>
        <p className="mt-1">{format(m.results.printIntro, { date: today })}</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-semibold outline-none sm:text-4xl">
            {m.results.title}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {format(m.results.count, { shown: shown.length, total: formatNumber(outcome.candidateCount) })}{" "}
            {format(m.results.searched, { count: formatNumber(outcome.searchedCount) })}
          </p>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil aria-hidden />
            {m.results.editAnswers}
          </Button>
          <Button variant="outline" size="sm" onClick={onNewSearch}>
            <RotateCcw aria-hidden />
            {m.results.newSearch}
          </Button>
          {results.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer aria-hidden />
              {m.results.print}
            </Button>
          )}
        </div>
      </div>

      <Disclaimer />

      <div className="space-y-3" aria-live="polite">
        {analysis.status === "pending" && (
          <Notice icon={<TypingDots label={m.chat.typing} className="mt-2.5 text-primary" />}>{m.results.analyzing}</Notice>
        )}
        {analysis.status === "ok" && (
          <Notice icon={<Sparkles className="mt-1 size-4 shrink-0 text-primary" aria-hidden />}>
            {m.results.aiNote}
            {analysis.experimental && <span className="mt-1 block font-medium">{m.results.experimental}</span>}
          </Notice>
        )}
        {analysis.status === "degraded" && <Notice tone="warn">{m.results.degraded}</Notice>}
        {outcome.keywordOnly && <Notice tone="warn">{m.results.keywordOnly}</Notice>}
      </div>

      {results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <h2 className="text-2xl font-semibold">{m.results.emptyTitle}</h2>
          <p className="mx-auto mt-2 max-w-prose text-muted-foreground">{m.results.emptyBody}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {session.answers.travelMiles !== null && <Button onClick={onWiden}>{m.results.emptyWiden}</Button>}
            <Button variant="outline" onClick={onEdit}>
              {m.results.editAnswers}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <ol className="space-y-5">
            {shown.map((t, i) => (
              <li key={t.card.id}>
                <ResultCard trial={t} index={i} />
              </li>
            ))}
          </ol>
          {results.length > visible && (
            <div className="no-print flex justify-center">
              <Button variant="outline" onClick={() => setVisible(results.length)}>
                {m.common.showMore}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
