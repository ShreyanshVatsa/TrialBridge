"use client";

import { useEffect, useRef, useState } from "react";
import { loadErrorCode } from "@/components/format";
import { useMessages } from "@/components/i18n";
import { emptyState, type QuestionnaireState } from "@/components/questionnaire/contract";
import { QuestionnaireFlow } from "@/components/questionnaire/questionnaire-flow";
import { ResultsView, SearchProgressView } from "@/components/results/results-view";
import { useSession } from "@/components/session/session-provider";
import { Disclaimer } from "@/components/site/disclaimer";
import { ErrorView } from "@/components/site/error-view";
import { lookupZip } from "@/lib/data/loader";
import type { IntakeAnswers, Language, RankedTrial, SearchProgress } from "@/lib/types";

type Status =
  | { kind: "idle" }
  | { kind: "searching"; progress: SearchProgress }
  | { kind: "error"; code: ReturnType<typeof loadErrorCode>; answers: IntakeAnswers };

const TURNSTILE_TIMEOUT_MS = 30_000;
const warmedUp = new Set<string>();

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
 * Questionnaire answers stay in the browser (memory + this tab's sessionStorage). Only `requestAnalysis` talks to
 * the backend, and it sends the minimized profile (no ZIP, no exact age, no health history) plus trial IDs.
 */
export function FindFlow() {
  const m = useMessages();
  const { questionnaire, setQuestionnaire, session, setSession } = useSession();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  // "Fill in what you found out" from the results page reopens exactly those questions.
  const [fillRequest, setFillRequest] = useState<string[] | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  // Warm-up: as soon as a cancer type is picked, download that type's shard(s) and the on-device model in
  // the background (static files only), so the search itself is fast. Skipped when the browser asks to save data.
  const cancerType = questionnaire.answers.cancer_type as IntakeAnswers["cancerType"] | undefined;
  useEffect(() => {
    if (!cancerType || warmedUp.has(cancerType)) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData) return;
    warmedUp.add(cancerType);
    void import("@/lib/match/search").then(({ prefetchSearch }) => prefetchSearch(cancerType));
  }, [cancerType]);

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

  async function searchFromQuestionnaire(state: QuestionnaireState, language: Language) {
    const { toIntakeAnswers } = await import("@/components/questionnaire/engine");
    await runSearch(toIntakeAnswers(state, language));
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
      const [{ searchTrials }, { matchOptions }] = await Promise.all([import("@/lib/match/search"), import("@/components/questionnaire/engine")]);
      const [outcome, origin] = await Promise.all([
        searchTrials(answers, {
          ...(answers.questionnaire ? matchOptions(answers.cancerType) : {}),
          signal: ac.signal,
          onProgress: (progress) => setStatus({ kind: "searching", progress }),
        }),
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
          if (session.answers.questionnaire) setQuestionnaire(session.answers.questionnaire);
          setSession(null);
        }}
        onFill={(ids) => {
          if (session.answers.questionnaire) setQuestionnaire(session.answers.questionnaire);
          setFillRequest(ids);
          setSession(null);
        }}
        onNewSearch={() => {
          void import("@/components/questionnaire/engine").then((e) => e.clearSession());
          setQuestionnaire(emptyState());
          setSession(null);
        }}
        onWiden={() => {
          const q = session.answers.questionnaire;
          const widenedQ = q ? { ...q, answers: { ...q.answers, travel: "anywhere" }, updatedAt: Date.now() } : undefined;
          if (widenedQ) setQuestionnaire(widenedQ);
          const widened = { ...session.answers, travelMiles: null, ...(widenedQ ? { questionnaire: widenedQ } : {}) };
          void runSearch(widened);
        }}
      />
    );
  } else {
    body = (
      <>
        <h1 className="mb-6 text-3xl font-semibold sm:text-4xl">{m.chat.title}</h1>
        <QuestionnaireFlow
          state={questionnaire}
          setState={setQuestionnaire}
          fillRequest={fillRequest}
          onFillHandled={() => setFillRequest(null)}
          onSearch={(s, lang) => void searchFromQuestionnaire(s, lang)}
        />
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
