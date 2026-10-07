"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { IntakeAnswers, RankedTrial, SearchOutcome } from "@/lib/types";

/**
 * In-memory session state shared across client-side navigation (find -> trial detail -> back).
 * Nothing here is persisted: no localStorage, no cookies, no server. A refresh clears it.
 */
export type AnalysisState =
  | { status: "idle" }
  | { status: "pending" }
  | { status: "ok"; experimental: boolean }
  | { status: "degraded" };

export interface SearchSession {
  answers: IntakeAnswers;
  outcome: SearchOutcome;
  results: RankedTrial[];
  analysis: AnalysisState;
  origin: { lat: number; lon: number } | null;
  searchedAt: number;
}

interface SessionValue {
  draft: Partial<IntakeAnswers>;
  setDraft: (next: Partial<IntakeAnswers>) => void;
  session: SearchSession | null;
  setSession: (next: SearchSession | null | ((prev: SearchSession | null) => SearchSession | null)) => void;
  reset: () => void;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<Partial<IntakeAnswers>>({});
  const [session, setSession] = useState<SearchSession | null>(null);

  const value = useMemo<SessionValue>(
    () => ({
      draft,
      setDraft,
      session,
      setSession,
      reset: () => {
        setDraft({});
        setSession(null);
      },
    }),
    [draft, session],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}
