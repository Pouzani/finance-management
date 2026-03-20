import React from "react";

type BadgeVariant = "primary" | "error" | "secondary" | "tertiary" | "neutral" | "custom";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  /** Override colors when variant="custom" */
  color?: string;
  bg?: string;
  className?: string;
}

const variantMap: Record<BadgeVariant, { color: string; bg: string }> = {
  primary: {
    color: "var(--primary)",
    bg: "var(--primary-container)",
  },
  error: {
    color: "var(--error)",
    bg: "rgba(254,137,131,0.2)",
  },
  secondary: {
    color: "var(--on-secondary-container)",
    bg: "var(--secondary-container)",
  },
  tertiary: {
    color: "var(--on-tertiary-container)",
    bg: "var(--tertiary-container)",
  },
  neutral: {
    color: "var(--on-surface-variant)",
    bg: "var(--surface-container-high)",
  },
  custom: {
    color: "",
    bg: "",
  },
};

export default function Badge({
  children,
  variant = "neutral",
  color,
  bg,
  className = "",
}: BadgeProps) {
  const base = variantMap[variant];
  return (
    <span
      className={`inline-flex items-center text-xs font-bold px-2 py-1 rounded-full ${className}`}
      style={{
        color: color ?? base.color,
        backgroundColor: bg ?? base.bg,
      }}
    >
      {children}
    </span>
  );
}
