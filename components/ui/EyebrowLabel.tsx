import React from "react";

interface EyebrowLabelProps {
  children: React.ReactNode;
  className?: string;
  light?: boolean; // for use on dark/colored backgrounds
}

export default function EyebrowLabel({
  children,
  className = "",
  light = false,
}: EyebrowLabelProps) {
  return (
    <p
      className={`font-bold uppercase tracking-widest ${className}`}
      style={{
        fontSize: "10px",
        color: light ? "rgba(217,255,254,0.7)" : "var(--on-surface-variant)",
      }}
    >
      {children}
    </p>
  );
}
