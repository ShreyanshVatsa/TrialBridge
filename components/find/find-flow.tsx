"use client";

import { useEffect, useRef, useState } from "react";
import { IntakeChat } from "@/components/chat/intake-chat";
import { loadErrorCode } from "@/components/format";
import { useMessages } from "@/components/i18n";
import { ResultsView, SearchProgressView } from "@/components/results/results-view";
import { useSession } from "@/components/session/session-provider";
import { Disclaimer } from "@/components/site/disclaimer";
import { ErrorView } from "@/components/site/error-view";
import { lookupZip } from "@/lib/data/loader";
import type { IntakeAnswers, RankedTrial, SearchProgress } from "@/lib/types";

type Status =
  | { kind: "idle" }
  | { kind: "searching"; progress: SearchProgress }
  | { kind: "error"; code: ReturnType<typeof loadErrorCode>; answers: IntakeAnswers };

const TURNSTILE_TIMEOUT_MS = 30_000;
let warmedUp = false;

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e: unknown) => {
        clearTimeout(t);
        reject(e instanceof Error ? e : new Error("failed"));
      },
    );
  });
}

/**
 * Orchestrates intake -> on-device search -> AI explanations.
 * Intake answers stay in memory (SessionProvider). Only `requestAnalysis` talks to the backend,
 * and it sends the minimized profile (no ZIP, no exact age) plus trial IDs.
 */
export function FindFlow() {
  const m = useMessages();
  const { draft, setDraft, session, setSession } = useSession();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const abortRef = useRef<AbortController | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  // Warm-up: once the user starts the intake, load the matching engine and the on-device model in the
  // background so the search itself is fast. Skipped when the browser asks to save data.
  const started = draft.cancerType !== undefined;
  useEffect(() => {
    if (!started || warmedUp) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData) return;
    warmedUp = true;
    void import("@/lib/match/embedder").then(({ embedProfile }) => embedProfile("warm up", { timeoutMs: 120_000 }));
    void import("@/lib/match/search");
  }, [started]);

  async function runAnalysis(answers: IntakeAnswers, results: RankedTrial[], searchedAt: number) {
    const isCurrent = (prev: typeof session) => prev !== null && prev.searchedAt === searchedAt;
    try {
      const container = turnstileRef.current;
      if (!container) throw new Error("no turnstile container");
      // Code-split: the AI client and Turnstile loader download only after a search.
      const [{ getTurnstileToken }, { requestAnalysis }, { applyAnalysis }] = await Promise.all([
        import("@/lib/api/turnstile"),
        import("@/lib/api/analyze"),
        import("@/lib/match/search"),
      ]);
      const token = await withTimeout(getTurnstileToken(container), TURNSTILE_TIMEOUT_MS);
      const response = await requestAnalysis(
        answers,
        results.map((r) => r.card.id),
        token,
      );
      setSession((prev) => {
        if (!prev || !isCurrent(prev)) return prev;
        if (response.status === "ok") {
          return { ...prev, results: applyAnalysis(prev.results, response), analysis: { status: "ok", experimental: response.experimental } };
        }
        return { ...prev, analysis: { status: "degraded" } };
      });
    } catch {
      setSession((prev) => (prev && isCurrent(prev) ? { ...prev, analysis: { status: "degraded" } } : prev));
    }
  }

  async function runSearch(answers: IntakeAnswers) {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setSession(null);
    setStatus({ kind: "searching", progress: { stage: "loading_shards" } });
    window.scrollTo({ top: 0 });
    try {
      // Code-split: the matching engine (search index, embeddings worker) loads only when searching.
      const { searchTrials } = await import("@/lib/match/search");
      const [outcome, origin] = await Promise.all([
        searchTrials(answers, { signal: ac.signal, onProgress: (progress) => setStatus({ kind: "searching", progress }) }),
        lookupZip(answers.zip).catch(() => null),
      ]);
      if (ac.signal.aborted) return;
      const searchedAt = Date.now();
      const hasResults = outcome.results.length > 0;
      setSession({
        answers,
        outcome,
        results: outcome.results,
        analysis: hasResults ? { status: "pending" } : { status: "idle" },
        origin,
        searchedAt,
      });
      setStatus({ kind: "idle" });
      if (hasResults) void runAnalysis(answers, outcome.results, searchedAt);
    } catch (err) {
      if (ac.signal.aborted) return;
      setStatus({ kind: "error", code: loadErrorCode(err), answers });
    }
  }

  let body;
  if (status.kind === "searching") {
    body = <SearchProgressView progress={status.progress} />;
  } else if (status.kind === "error") {
    const offline = typeof navigator !== "undefined" && !navigator.onLine;
    const msg = offline
      ? m.common.offline
      : status.code === "timeout"
        ? m.search.errorTimeout
        : status.code === "invalid"
          ? m.search.errorInvalid
          : m.search.error;
    body = <ErrorView body={msg} onRetry={() => void runSearch(status.answers)} />;
  } else if (session) {
    body = (
      <ResultsView
        session={session}
        onEdit={() => {
          setDraft(session.answers);
          setSession(null);
        }}
        onNewSearch={() => {
          setDraft({});
          setSession(null);
        }}
        onWiden={() => {
          const widened = { ...session.answers, travelMiles: null };
          setDraft(widened);
          void runSearch(widened);
        }}
      />
    );
  } else {
    body = (
      <>
        <h1 className="mb-6 text-3xl font-semibold sm:text-4xl">{m.chat.title}</h1>
        <IntakeChat draft={draft} setDraft={setDraft} onSearch={(a) => void runSearch(a)} />
        <Disclaimer className="mt-8" />
      </>
    );
  }

  return (
    <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      {body}
      {/* Turnstile renders an interaction-only widget here when a check is needed. */}
      <div className="no-print mt-6 flex justify-center" aria-label={m.results.verification} role="region" ref={turnstileRef} />
    </main>
  );
}
