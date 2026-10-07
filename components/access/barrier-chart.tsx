"use client";

import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface BarrierDatum {
  label: string;
  rate: number;
  count: number;
}

/** Horizontal bar chart of barrier rates (single series, so no legend; values labeled on each bar). */
export function BarrierChart({ data, valueLabel }: { data: BarrierDatum[]; valueLabel: (rate: number, count: number) => string }) {
  return (
    <div aria-hidden className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" accessibilityLayer={false} data={data} margin={{ top: 4, right: 72, bottom: 4, left: 4 }} barCategoryGap={10}>
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
            formatter={(value, _name, item) => [valueLabel(Number(value), (item.payload as BarrierDatum).count), ""]}
            separator=""
            contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--foreground)" }}
            labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
          />
          <Bar dataKey="rate" fill="var(--primary)" radius={[0, 4, 4, 0]} maxBarSize={28} isAnimationActive={false}>
            <LabelList dataKey="rate" position="right" fill="var(--foreground)" fontSize={13} formatter={(v) => `${String(v)}%`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
