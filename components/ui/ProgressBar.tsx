import React from "react";

interface ProgressBarProps {
  value: number; // 0–100
  color?: string;
  className?: string;
}

export default function ProgressBar({
  value,
  color = "var(--primary)",
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className={`w-full h-1.5 rounded-full overflow-hidden ${className}`}
      style={{ backgroundColor: "var(--surface-container-highest)" }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  );
}
