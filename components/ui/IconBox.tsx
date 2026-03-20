import React from "react";

type IconBoxSize = "sm" | "md" | "lg";
type IconBoxShape = "rounded-xl" | "rounded-2xl" | "rounded-full";

interface IconBoxProps {
  children: React.ReactNode;
  bg?: string;
  color?: string;
  size?: IconBoxSize;
  shape?: IconBoxShape;
  className?: string;
}

const sizeMap: Record<IconBoxSize, string> = {
  sm: "w-7 h-7",
  md: "w-9 h-9",
  lg: "w-11 h-11",
};

export default function IconBox({
  children,
  bg = "var(--surface-container)",
  color = "var(--on-surface-variant)",
  size = "md",
  shape = "rounded-xl",
  className = "",
}: IconBoxProps) {
  return (
    <div
      className={`${sizeMap[size]} ${shape} flex items-center justify-center shrink-0 ${className}`}
      style={{ backgroundColor: bg, color }}
    >
      {children}
    </div>
  );
}
