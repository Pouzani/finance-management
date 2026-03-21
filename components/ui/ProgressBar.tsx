import React from "react";

interface ProgressBarProps {
  value: number; // 0–100
  color?: string;
  trackColor?: string;
  className?: string;
}

export default function ProgressBar({
  value,
  color = "var(--primary)",
  trackColor = "var(--surface-container-highest)",
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className={`w-full h-1.5 rounded-full overflow-hidden ${className}`}
      style={{ backgroundColor: trackColor }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  );
}
