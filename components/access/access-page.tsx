"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CANCER_GROUPS, type CancerGroupId } from "@/config/cancer-groups";
import { format, localeFor, useLanguage, useMessages } from "@/components/i18n";
import { formatDate, formatNumber } from "@/components/format";
import { ErrorView } from "@/components/site/error-view";
import { TypingDots } from "@/components/site/spinner";
import { Button } from "@/components/ui/button";
import {
  getBarrierBreakdown,
  getGroupRows,
  getSiteTable,
  getStateRates,
  getSummary,
  loadAccess,
  pct,
  type AccessData,
  type BarrierMetric,
} from "@/lib/access/access";
import { loadMeta } from "@/lib/data/loader";
import { cn } from "@/lib/utils";
import { STATE_NAMES, UsTileMap } from "./us-tile-map";

type State = { kind: "loading" } | { kind: "error" } | { kind: "ok"; data: AccessData; seed: boolean };
const METRICS: BarrierMetric[] = ["any", "english_required", "upper_age_limit", "disability_exclusion"];
const groupLabel = (id: CancerGroupId) => CANCER_GROUPS.find((g) => g.id === id)?.label ?? id;

function Card({ title, children, className, id }: { title: string; children: ReactNode; className?: string; id?: string }) {
  return (
    <section aria-labelledby={id} className={cn("rounded-2xl border border-border bg-card p-5 sm:p-6", className)}>
      <h2 id={id} className="text-xl font-semibold sm:text-2xl">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Select({ label, value, onChange, children }: { label: string; value: string; onChange: (v: string) => void; children: ReactNode }) {
  const id = useId();
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-input bg-card px-3 text-base text-foreground"
      >
        {children}
      </select>
    </div>
  );
}

function Stat({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="font-heading text-4xl font-semibold tracking-tight text-primary tabular-nums">{value}</p>
      <p className="mt-2 font-medium">{label}</p>
      {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function AccessPage() {
  const m = useMessages();
  const lang = useLanguage();
  const locale = localeFor(lang);
  const [state, setState] = useState<State>({ kind: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [group, setGroup] = useState<CancerGroupId | null>(null);
  const [usState, setUsState] = useState<string | null>(null);
  const [metric, setMetric] = useState<BarrierMetric>("any");
  const [siteLimit, setSiteLimit] = useState(20);

  useEffect(() => {
    let cancelled = false;
    Promise.all([loadAccess(), loadMeta().catch(() => null)])
      .then(([data, meta]) => !cancelled && setState({ kind: "ok", data, seed: meta?.source === "seed" }))
      .catch(() => !cancelled && setState({ kind: "error" }));
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setState({ kind: "loading" });
    setAttempt((a) => a + 1);
  }, []);

  const data = state.kind === "ok" ? state.data : null;
  const view = useMemo(() => {
    if (!data) return null;
    const f = { state: usState, group };
    return {
      summary: getSummary(data, f),
      rates: getStateRates(data, { group, metric }),
      breakdown: getBarrierBreakdown(data, f),
      groups: getGroupRows(data, usState),
      sites: getSiteTable(data, { ...f, metric }),
      states: Object.keys(data.byState).sort((a, b) => (STATE_NAMES[a] ?? a).localeCompare(STATE_NAMES[b] ?? b)),
      groupIds: (Object.keys(data.byGroup) as CancerGroupId[]).filter((g) => g !== "other"),
    };
  }, [data, usState, group, metric]);

  const n = (x: number) => formatNumber(x, locale);
  const pc = (count: number, total: number) => format(m.access.pctCount, { rate: pct(count, total), count: n(count) });

  return (
    <main id="main" className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-12 sm:px-6 sm:py-16">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-semibold sm:text-5xl">{m.access.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{m.access.intro}</p>
        {state.kind === "ok" && (
          <p className="mt-3 text-sm text-muted-foreground">
            {format(m.access.dataDate, { date: formatDate(state.data.dataDate, locale) })}
            {state.seed && <> {m.access.seedNote}</>}
          </p>
        )}
      </header>

      {state.kind === "loading" && (
        <p role="status" className="flex items-center gap-3 py-16 text-lg text-muted-foreground">
          <TypingDots label="" className="text-primary" />
          {m.access.loading}
        </p>
      )}
      {state.kind === "error" && <ErrorView body={m.access.error} onRetry={retry} showHome={false} />}

      {data && view && (
        <>
          <section aria-label={m.access.filters} className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/40 p-4 sm:flex-row sm:items-end">
            <Select label={m.access.group} value={group ?? ""} onChange={(v) => setGroup(v ? (v as CancerGroupId) : null)}>
              <option value="">{m.access.allGroups}</option>
              {view.groupIds.map((g) => (
                <option key={g} value={g}>
                  {groupLabel(g)}
                </option>
              ))}
            </Select>
            <Select label={m.access.state} value={usState ?? ""} onChange={(v) => setUsState(v || null)}>
              <option value="">{m.access.allStates}</option>
              {view.states.map((s) => (
                <option key={s} value={s}>
                  {STATE_NAMES[s] ?? s}
                </option>
              ))}
            </Select>
            <Select label={m.access.metric} value={metric} onChange={(v) => setMetric(v as BarrierMetric)}>
              {METRICS.map((x) => (
                <option key={x} value={x}>
                  {m.access.metrics[x]}
                </option>
              ))}
            </Select>
            {(group || usState) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setGroup(null);
                  setUsState(null);
                }}
              >
                {m.access.clear}
              </Button>
            )}
          </section>

          <div aria-live="polite" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat value={n(view.summary.trials)} label={m.access.statTrials} />
            <Stat
              value={`${pct(view.summary.anyBarrier, view.summary.trials)}%`}
              label={m.access.statAny}
              sub={format(m.access.ofTrials, { count: n(view.summary.anyBarrier), total: n(view.summary.trials) })}
            />
            <Stat
              value={`${pct(view.summary.english_required, view.summary.trials)}%`}
              label={m.access.statEnglish}
              sub={format(m.access.ofTrials, { count: n(view.summary.english_required), total: n(view.summary.trials) })}
            />
            <Stat
              value={`${pct(view.summary.upper_age_limit, view.summary.trials)}%`}
              label={m.access.statAge}
              sub={format(m.access.ofTrials, { count: n(view.summary.upper_age_limit), total: n(view.summary.trials) })}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <Card title={`${m.access.mapTitle}: ${m.access.metrics[metric]}`} id="map-title">
              <p className="mb-4 text-sm text-muted-foreground">{m.access.mapNote}</p>
              <UsTileMap rates={view.rates} selected={usState} onSelect={setUsState} />
            </Card>

            <Card title={m.access.chartTitle} id="chart-title">
              <p className="mb-2 text-sm text-muted-foreground">{m.access.chartNote}</p>
              <figure aria-labelledby="chart-title">
                <ul className="sr-only">
                  {view.breakdown.map((b) => (
                    <li key={b.type}>
                      {m.access.metrics[b.type]}: {format(m.access.chartValue, { rate: b.rate, count: n(b.count) })}
                    </li>
                  ))}
                </ul>
                <div aria-hidden className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={view.breakdown.map((b) => ({ ...b, label: m.access.metrics[b.type] }))}
                      margin={{ top: 4, right: 72, bottom: 4, left: 4 }}
                      barCategoryGap={10}
                    >
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis
                        type="category"
                        dataKey="label"
                        width={130}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "var(--foreground)", fontSize: 14 }}
                      />
                      <Tooltip
                        cursor={{ fill: "var(--muted)" }}
                        formatter={(value, _name, item) => [
                          format(m.access.chartValue, { rate: Number(value), count: n((item.payload as { count: number }).count) }),
                          "",
                        ]}
                        separator=""
                        contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--foreground)" }}
                        labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
                      />
                      <Bar dataKey="rate" fill="var(--primary)" radius={[0, 4, 4, 0]} maxBarSize={28} isAnimationActive={false}>
                        <LabelList
                          dataKey="rate"
                          position="right"
                          fill="var(--foreground)"
                          fontSize={13}
                          formatter={(v) => `${String(v)}%`}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </figure>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {view.breakdown.map((b) => (
                  <li key={b.type} className="flex justify-between gap-3">
                    <span>{m.access.metrics[b.type]}</span>
                    <span className="tabular-nums">{format(m.access.chartValue, { rate: b.rate, count: n(b.count) })}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card title={m.access.groupsTitle} id="groups-title">
            <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {view.groups
                .filter((g) => g.trials > 0 && g.group !== "other")
                .map((g) => (
                  <li key={g.group}>
                    <button
                      type="button"
                      onClick={() => setGroup(group === g.group ? null : g.group)}
                      aria-pressed={group === g.group}
                      className={cn(
                        "w-full rounded-lg px-2 py-1.5 text-left hover:bg-muted",
                        group === g.group && "bg-secondary",
                      )}
                    >
                      <span className="flex justify-between gap-3">
                        <span className="font-medium">{groupLabel(g.group)}</span>
                        <span className="text-sm text-muted-foreground tabular-nums">{pc(g.anyBarrier, g.trials)}</span>
                      </span>
                      <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
                        <span className="block h-full rounded-full bg-primary" style={{ width: `${g.rate}%` }} />
                      </span>
                    </button>
                  </li>
                ))}
            </ul>
          </Card>

          <Card title={format(m.access.sitesTitle, { min: data.minSiteTrials })} id="sites-title">
            <p className="mb-4 text-sm text-muted-foreground">{m.access.sitesNote}</p>
            {view.sites.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border p-6 text-center text-muted-foreground">
                {format(m.access.sitesEmpty, { min: data.minSiteTrials })}
              </p>
            ) : (
              <div className="-mx-5 overflow-x-auto sm:mx-0" tabIndex={0} role="region" aria-labelledby="sites-title">
                <table className="w-full min-w-[44rem] text-left text-sm">
                  <thead className="border-b border-border text-muted-foreground">
                    <tr>
                      <th scope="col" className="px-3 py-2 font-medium">{m.access.colRank}</th>
                      <th scope="col" className="px-3 py-2 font-medium">{m.access.colSite}</th>
                      <th scope="col" className="px-3 py-2 text-right font-medium">{m.access.colTrials}</th>
                      {METRICS.map((x) => (
                        <th key={x} scope="col" className={cn("px-3 py-2 text-right font-medium", x === metric && "text-foreground")}>
                          {m.access.metrics[x]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {view.sites.slice(0, siteLimit).map((s, i) => (
                      <tr key={`${s.facility}-${s.city}-${s.state}`}>
                        <td className="px-3 py-2.5 text-muted-foreground tabular-nums">{i + 1}</td>
                        <th scope="row" className="px-3 py-2.5 font-medium">
                          {s.facility}
                          <span className="block font-normal text-muted-foreground">
                            {s.city}, {s.state}
                          </span>
                        </th>
                        <td className="px-3 py-2.5 text-right tabular-nums">{n(s.trials)}</td>
                        <td className={cn("px-3 py-2.5 text-right tabular-nums", metric === "any" && "font-semibold")}>{pc(s.anyBarrier, s.trials)}</td>
                        <td className={cn("px-3 py-2.5 text-right tabular-nums", metric === "english_required" && "font-semibold")}>
                          {pc(s.english_required, s.trials)}
                        </td>
                        <td className={cn("px-3 py-2.5 text-right tabular-nums", metric === "upper_age_limit" && "font-semibold")}>
                          {pc(s.upper_age_limit, s.trials)}
                        </td>
                        <td className={cn("px-3 py-2.5 text-right tabular-nums", metric === "disability_exclusion" && "font-semibold")}>
                          {pc(s.disability_exclusion, s.trials)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {view.sites.length > siteLimit && (
              <div className="mt-4 flex justify-center">
                <Button variant="outline" onClick={() => setSiteLimit((l) => l + 30)}>
                  {m.common.showMore}
                </Button>
              </div>
            )}
          </Card>

          <section className="rounded-2xl border border-border bg-muted/40 p-5 sm:p-6">
            <h2 className="text-xl font-semibold">{m.access.howFlagged}</h2>
            <p className="mt-2 max-w-[70ch] text-muted-foreground">{m.access.howFlaggedBody}</p>
            <Link href="/methodology/" className="mt-3 inline-block font-medium text-primary underline underline-offset-4">
              {m.access.methodologyLink}
            </Link>
          </section>
        </>
      )}
    </main>
  );
}
