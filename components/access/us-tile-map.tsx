"use client";

import { format, useMessages } from "@/components/i18n";
import { cn } from "@/lib/utils";

/**
 * U.S. tile-grid map: one equal-size square per state (plus DC and PR), placed to echo geography.
 * Equal tiles keep small states readable and avoid a map-geometry dependency.
 * Colors: single-hue sequential blue ramp (colorblind-safe, validated reference palette),
 * and every tile is also labeled with its rate, so color is never the only cue.
 */
const GRID: Record<string, [number, number]> = {
  AK: [0, 0], ME: [11, 0],
  VT: [10, 1], NH: [11, 1],
  WA: [1, 2], ID: [2, 2], MT: [3, 2], ND: [4, 2], MN: [5, 2], IL: [6, 2], WI: [7, 2], MI: [8, 2], NY: [9, 2], RI: [10, 2], MA: [11, 2],
  OR: [1, 3], NV: [2, 3], WY: [3, 3], SD: [4, 3], IA: [5, 3], IN: [6, 3], OH: [7, 3], PA: [8, 3], NJ: [9, 3], CT: [10, 3],
  CA: [1, 4], UT: [2, 4], CO: [3, 4], NE: [4, 4], MO: [5, 4], KY: [6, 4], WV: [7, 4], VA: [8, 4], MD: [9, 4], DE: [10, 4],
  AZ: [2, 5], NM: [3, 5], KS: [4, 5], AR: [5, 5], TN: [6, 5], NC: [7, 5], SC: [8, 5], DC: [9, 5],
  OK: [4, 6], LA: [5, 6], MS: [6, 6], AL: [7, 6], GA: [8, 6],
  HI: [0, 7], TX: [4, 7], FL: [9, 7], PR: [11, 7],
};

export const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado", CT: "Connecticut", DE: "Delaware",
  DC: "District of Columbia", FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota",
  MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon",
  PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah",
  VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming", PR: "Puerto Rico",
  GU: "Guam", VI: "U.S. Virgin Islands",
};

/** Sequential ramp (light -> dark). Text on the two darkest steps is white, otherwise ink (AA contrast). */
const RAMP = ["#cde2fb", "#86b6ef", "#3987e5", "#1c5cab", "#0d366b"] as const;

export interface StateRate {
  state: string;
  trials: number;
  count: number;
  rate: number;
}

/** Bin edges are derived from the data's max so the ramp uses its full range; labels show exact values. */
function makeBins(maxRate: number): number[] {
  const top = Math.max(5, Math.ceil(maxRate / 5) * 5);
  return [1, 2, 3, 4].map((i) => Math.round((top * i) / 5));
}

export function UsTileMap({
  rates,
  selected,
  onSelect,
}: {
  rates: StateRate[];
  selected: string | null;
  onSelect: (state: string | null) => void;
}) {
  const m = useMessages();
  const byState = new Map(rates.map((r) => [r.state, r]));
  const bins = makeBins(Math.max(0, ...rates.filter((r) => r.trials > 0).map((r) => r.rate)));
  const binOf = (rate: number) => bins.filter((b) => rate >= b).length;

  return (
    <div>
      <div className="grid grid-cols-12 gap-[3px] sm:gap-1">
        {Object.entries(GRID).map(([code, [col, row]]) => {
          const r = byState.get(code);
          const has = !!r && r.trials > 0;
          const bin = has ? binOf(r.rate) : -1;
          const label = has
            ? format(m.access.mapTile, { state: STATE_NAMES[code] ?? code, rate: r.rate, count: r.count, trials: r.trials })
            : format(m.access.mapNoData, { state: STATE_NAMES[code] ?? code });
          const isSel = selected === code;
          return (
            <button
              key={code}
              type="button"
              disabled={!has}
              title={label}
              aria-label={label}
              aria-pressed={isSel}
              onClick={() => onSelect(isSel ? null : code)}
              style={{ gridColumnStart: col + 1, gridRowStart: row + 1, backgroundColor: has ? RAMP[bin] : undefined }}
              className={cn(
                "flex aspect-square min-w-0 flex-col items-center justify-center rounded-[4px] leading-none transition-transform",
                has ? "hover:scale-105 hover:shadow-md" : "bg-muted text-muted-foreground",
                has && (bin >= 3 ? "text-white" : "text-[#0d1b2a]"),
                isSel && "ring-3 ring-foreground ring-offset-2 ring-offset-background",
              )}
            >
              <span className="text-[0.6rem] font-semibold sm:text-xs">{code}</span>
              {/* Percentage drawn via CSS content: visible on larger screens, while the tile's text stays the
                  state code (the full value is in the accessible name). */}
              {has && (
                <span
                  aria-hidden
                  data-pct={`${Math.round(r.rate)}%`}
                  className="mt-0.5 hidden text-[0.65rem] tabular-nums after:content-[attr(data-pct)] sm:block"
                />
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground" aria-hidden>
        {RAMP.map((c, i) => (
          <span key={c} className="inline-flex items-center gap-1.5">
            <span className="size-3.5 rounded-[3px]" style={{ backgroundColor: c }} />
            {i === 0 ? `< ${bins[0]}%` : i === RAMP.length - 1 ? `≥ ${bins[i - 1]}%` : `${bins[i - 1]}–${bins[i]}%`}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3.5 rounded-[3px] bg-muted" />
          {m.access.legendNoData}
        </span>
      </div>
    </div>
  );
}
