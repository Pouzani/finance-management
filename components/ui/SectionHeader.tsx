import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  action,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`flex items-start justify-between ${className}`}>
      <div>
        <h3
          className="font-bold text-lg leading-tight"
          style={{ fontFamily: "var(--font-manrope), sans-serif", color: "var(--on-surface)" }}
        >
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: "var(--on-surface-variant)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 ml-4">{action}</div>}
    </div>
  );
}
