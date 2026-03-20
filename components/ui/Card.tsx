"use client";

import React from "react";

type CardPadding = "none" | "sm" | "md" | "lg";
type CardAs = "div" | "section" | "aside" | "article";

interface CardProps {
  children: React.ReactNode;
  padding?: CardPadding;
  as?: CardAs;
  overflow?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const paddingMap: Record<CardPadding, string> = {
  none: "",
  sm: "p-5",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  children,
  padding = "md",
  as: Tag = "div",
  overflow = false,
  className = "",
  style,
  onClick,
}: CardProps) {
  return (
    <Tag
      className={`rounded-3xl shadow-ambient ${paddingMap[padding]} ${overflow ? "overflow-hidden" : ""} ${onClick ? "cursor-pointer transition-all hover:-translate-y-0.5" : ""} ${className}`}
      style={{
        backgroundColor: "var(--surface-container-lowest)",
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </Tag>
  );
}
