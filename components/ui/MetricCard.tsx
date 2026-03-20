import React from "react";
import Badge from "./Badge";
import ProgressBar from "./ProgressBar";
import EyebrowLabel from "./EyebrowLabel";

interface MetricCardProps {
  label: string;
  value: string;
  badge?: React.ReactNode;
  accentColor?: string;
  progress?: number; // 0-100, omit to hide bar
}

export default function MetricCard({
  label,
  value,
  badge,
  accentColor = "var(--tertiary)",
  progress,
}: MetricCardProps) {
  return (
    <div
      className="flex-1 bg-white p-6 rounded-3xl flex flex-col justify-center border-l-4 shadow-ambient"
      style={{ borderLeftColor: accentColor }}
    >
      <EyebrowLabel>{label}</EyebrowLabel>

      <div className="mt-4 flex items-end justify-between">
        <span
          className="text-2xl font-black font-numeric"
          style={{ fontFamily: "var(--font-manrope), sans-serif", color: "var(--on-surface)" }}
        >
          {value}
        </span>
        {badge}
      </div>

      {progress !== undefined && (
        <ProgressBar value={progress} color={accentColor} className="mt-4" />
      )}
    </div>
  );
}
