"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WaterLog, WeightLog } from "@/lib/types";

const ORANGE = "#FF5E1A";
const GRID = "#262a33";
const MUTED = "#8b919e";

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

export function WeightChart({
  data,
  targetWeightKg,
}: {
  data: WeightLog[];
  targetWeightKg: number | null;
}) {
  if (data.length === 0) {
    return <EmptyState message="Log your first weight to see your progress here." />;
  }

  const chartData = data.map((d) => ({
    date: new Date(d.logged_on).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    weight: Number(d.weight_kg),
    bmi: d.bmi !== null ? Number(d.bmi) : null,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke={MUTED} fontSize={11} tickLine={false} />
          <YAxis stroke={MUTED} fontSize={11} tickLine={false} domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{ background: "#15181e", border: `1px solid ${GRID}`, borderRadius: 8, color: "#fff" }}
          />
          {targetWeightKg !== null && (
            <ReferenceLine
              y={Number(targetWeightKg)}
              stroke={MUTED}
              strokeDasharray="6 4"
              label={{ value: "Target", fill: MUTED, fontSize: 11 }}
            />
          )}
          <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke={ORANGE} strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="bmi" name="BMI" stroke="#38bdf8" strokeWidth={2} dot={false} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WaterChart({ data, goalMl }: { data: WaterLog[]; goalMl: number }) {
  if (data.length === 0) {
    return <EmptyState message="Log your water intake to see your hydration trend." />;
  }

  // Aggregate by day over the last 14 days
  const byDay = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const day = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    byDay.set(day, 0);
  }
  for (const log of data) {
    if (byDay.has(log.logged_on)) {
      byDay.set(log.logged_on, (byDay.get(log.logged_on) ?? 0) + log.amount_ml);
    }
  }

  const chartData = Array.from(byDay.entries()).map(([day, total]) => ({
    date: new Date(day).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    ml: total,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke={MUTED} fontSize={11} tickLine={false} />
          <YAxis stroke={MUTED} fontSize={11} tickLine={false} />
          <Tooltip
            cursor={{ fill: "rgba(255,94,26,0.08)" }}
            contentStyle={{ background: "#15181e", border: `1px solid ${GRID}`, borderRadius: 8, color: "#fff" }}
          />
          <ReferenceLine y={goalMl} stroke={MUTED} strokeDasharray="6 4" label={{ value: "Goal", fill: MUTED, fontSize: 11 }} />
          <Bar dataKey="ml" name="Water (ml)" fill={ORANGE} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
