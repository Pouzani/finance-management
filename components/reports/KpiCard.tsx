"use client";

import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import EyebrowLabel from "@/components/ui/EyebrowLabel";

export type TrendDir = "up" | "down" | "neutral";

interface KpiCardProps {
  label: string;
  value: string;
  accent: string;
  trend: TrendDir;
  sub: string;
  valueColor?: string;
}

export default function KpiCard({ label, value, accent, trend, sub, valueColor }: KpiCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : ArrowRight;
  const trendColor = trend === "up" ? "var(--primary)" : trend === "down" ? "#e57373" : "var(--on-surface-variant)";

  return (
    <div
      className="rounded-3xl p-5 shadow-ambient flex flex-col gap-3"
      style={{ backgroundColor: "var(--surface-container-lowest)", borderLeft: `3px solid ${accent}` }}
    >
      <EyebrowLabel>{label}</EyebrowLabel>
      <div
        className="font-numeric leading-none"
        style={{
          fontFamily: "var(--font-manrope), sans-serif",
          fontSize: "1.375rem",
          fontWeight: 900,
          color: valueColor ?? "var(--on-surface)",
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
      <div className="flex items-center gap-1.5">
        <TrendIcon size={12} strokeWidth={2.5} style={{ color: trendColor }} />
        <span style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", fontWeight: 500 }}>
          {sub}
        </span>
      </div>
    </div>
  );
}
