import React from "react";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = "", style, onFocus, onBlur, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`outline-none ${className}`}
        style={{
          width: "100%",
          padding: "10px 14px",
          fontSize: "14px",
          fontFamily: "var(--font-inter), sans-serif",
          backgroundColor: "var(--surface-container)",
          color: "var(--on-surface)",
          border: "2px solid transparent",
          borderRadius: "0.75rem",
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "rgba(22,105,105,0.25)";
          onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "transparent";
          onBlur?.(e);
        }}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
export default Input;
