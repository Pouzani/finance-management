import React from "react";

type ButtonVariant = "primary" | "ghost" | "link" | "icon";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: "6px 12px", fontSize: "10px" },
  md: { padding: "8px 16px", fontSize: "12px" },
  lg: { padding: "12px 20px", fontSize: "14px" },
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: "linear-gradient(135deg, #166969 0%, #0a5a5a 100%)",
    color: "var(--on-primary)",
    boxShadow: "0 4px 12px rgba(22,105,105,0.28)",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "var(--on-surface-variant)",
  },
  link: {
    backgroundColor: "transparent",
    color: "var(--primary)",
    padding: 0,
  },
  icon: {
    backgroundColor: "var(--surface-container)",
    color: "var(--on-surface-variant)",
    padding: "8px",
    borderRadius: "50%",
  },
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  style,
  className = "",
  ...props
}: ButtonProps) {
  const isLink = variant === "link";
  const isIcon = variant === "icon";

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-bold transition-all active:scale-95 ${isLink ? "hover:underline" : "hover:opacity-90"} ${className}`}
      style={{
        fontFamily: "var(--font-manrope), sans-serif",
        borderRadius: isIcon ? "50%" : "0.75rem",
        cursor: "pointer",
        border: "none",
        outline: "none",
        ...(isLink ? {} : sizeStyles[size]),
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
