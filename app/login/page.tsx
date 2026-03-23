"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login, setTokens, extractErrorMessage } from "@/lib/auth";

// ── Shared primitives ────────────────────────────────────────────────────────

function AuthInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "0.8125rem",
          fontWeight: 500,
          color: "var(--on-surface-variant)",
          fontFamily: "var(--font-inter), sans-serif",
          marginBottom: "0.5rem",
          letterSpacing: "0.01em",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "0.875rem 1rem",
          backgroundColor: focused
            ? "var(--surface-container-lowest)"
            : "var(--surface-container-highest)",
          border: "none",
          borderRadius: "0.5rem",
          fontSize: "0.9375rem",
          color: "var(--on-surface)",
          fontFamily: "var(--font-inter), sans-serif",
          outline: "none",
          boxShadow: focused ? "0 0 0 2px rgba(22,105,105,0.25)" : "none",
          transition: "background 0.15s, box-shadow 0.15s",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

// ── Left decorative panel ────────────────────────────────────────────────────

function BrandPanel() {
  return (
    <div
      className="hero-card"
      style={{
        width: "42%",
        minWidth: "340px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "3rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="grain-overlay" />

      {/* Wordmark */}
      <div className="anim-enter" style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "rgba(166,239,239,0.12)",
            borderRadius: "9999px",
            padding: "0.375rem 0.875rem",
            marginBottom: "2.5rem",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1" y="1" width="10" height="10" rx="2" stroke="rgba(166,239,239,0.8)" strokeWidth="1.2" />
            <line x1="3" y1="4" x2="9" y2="4" stroke="rgba(166,239,239,0.8)" strokeWidth="1" strokeLinecap="round" />
            <line x1="3" y1="6.5" x2="9" y2="6.5" stroke="rgba(166,239,239,0.8)" strokeWidth="1" strokeLinecap="round" />
            <line x1="3" y1="9" x2="6.5" y2="9" stroke="rgba(166,239,239,0.8)" strokeWidth="1" strokeLinecap="round" />
          </svg>
          <span
            style={{
              fontSize: "10px",
              fontFamily: "var(--font-inter), sans-serif",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--primary-container)",
              fontWeight: 500,
            }}
          >
            Finance Personnelle
          </span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-manrope), sans-serif",
            fontSize: "clamp(2.25rem, 3.5vw, 3.25rem)",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.08,
            margin: 0,
            marginBottom: "1.25rem",
          }}
        >
          Le Grand
          <br />
          Livre
        </h1>

        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "0.9375rem",
            color: "rgba(166,239,239,0.7)",
            lineHeight: 1.65,
            margin: 0,
            maxWidth: "28ch",
          }}
        >
          Votre atelier financier personnel — gérez, analysez et optimisez
          votre patrimoine avec précision.
        </p>
      </div>

      {/* Chart illustration + stat cards */}
      <div className="anim-enter anim-delay-2" style={{ position: "relative", zIndex: 1 }}>
        <svg
          viewBox="0 0 380 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%" }}
        >
          {/* Horizontal grid */}
          {[36, 72, 108, 144].map((y) => (
            <line key={y} x1="0" y1={y} x2="380" y2={y}
              stroke="rgba(166,239,239,0.07)" strokeWidth="1" />
          ))}
          {/* Vertical grid */}
          {[76, 152, 228, 304].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="180"
              stroke="rgba(166,239,239,0.04)" strokeWidth="1" />
          ))}
          {/* Area fill */}
          <path
            d="M0,155 C40,145 60,148 90,130 C120,112 140,95 180,80 C220,65 250,55 290,38 C320,25 355,18 380,14 L380,180 L0,180 Z"
            fill="url(#lgAreaGrad)"
          />
          {/* Trend line */}
          <path
            d="M0,155 C40,145 60,148 90,130 C120,112 140,95 180,80 C220,65 250,55 290,38 C320,25 355,18 380,14"
            fill="none"
            stroke="rgba(166,239,239,0.65)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Data points */}
          {([
            [0, 155], [90, 130], [180, 80], [290, 38], [380, 14],
          ] as [number, number][]).map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4.5"
              fill="rgba(166,239,239,0.85)"
              stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"
            />
          ))}
          <defs>
            <linearGradient id="lgAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(166,239,239,0.20)" />
              <stop offset="100%" stopColor="rgba(166,239,239,0)" />
            </linearGradient>
          </defs>
        </svg>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
          {[
            { label: "Actifs totaux", value: "124 500 MAD" },
            { label: "Croissance", value: "+18,4 %" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                flex: 1,
                backgroundColor: "rgba(166,239,239,0.08)",
                borderRadius: "0.875rem",
                padding: "0.875rem 1rem",
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(166,239,239,0.5)",
                  fontFamily: "var(--font-inter), sans-serif",
                  marginBottom: "0.375rem",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: "1.0625rem",
                  fontFamily: "var(--font-manrope), sans-serif",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const tokens = await login(username, password);
      setTokens(tokens.access, tokens.refresh);
      router.push("/dashboard");
    } catch (err) {
      setError(extractErrorMessage(err, "Identifiants invalides"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--surface-container-low)",
      }}
    >
      {/* Left branded panel — hidden on small screens */}
      <div style={{ display: "flex" }} className="auth-brand-panel">
        <BrandPanel />
      </div>

      {/* Right form panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 2rem",
          backgroundColor: "var(--surface-container-lowest)",
        }}
      >
        <div className="anim-enter" style={{ width: "100%", maxWidth: "400px" }}>
          {/* Icon + heading */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div
              style={{
                width: "2.75rem",
                height: "2.75rem",
                borderRadius: "0.75rem",
                background:
                  "linear-gradient(135deg, var(--primary) 0%, #1c9999 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
                boxShadow: "0 4px 12px rgba(22,105,105,0.35)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M3 4.5h12M3 9h12M3 13.5h7"
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h2
              style={{
                fontFamily: "var(--font-manrope), sans-serif",
                fontSize: "1.875rem",
                fontWeight: 800,
                color: "var(--on-surface)",
                margin: 0,
                marginBottom: "0.5rem",
                letterSpacing: "-0.01em",
              }}
            >
              Connexion
            </h2>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.9rem",
                color: "var(--on-surface-variant)",
                margin: 0,
              }}
            >
              Accédez à votre atelier financier
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}
          >
            {error && (
              <div
                style={{
                  backgroundColor: "var(--error-container)",
                  color: "var(--error)",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                {error}
              </div>
            )}

            <AuthInput
              label="Nom d'utilisateur"
              value={username}
              onChange={setUsername}
              placeholder="votre_nom"
              required
            />

            <AuthInput
              label="Mot de passe"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              required
            />

            <SubmitButton loading={loading} label="Se connecter" loadingLabel="Connexion…" />
          </form>

          <p
            style={{
              marginTop: "2rem",
              textAlign: "center",
              fontSize: "0.875rem",
              color: "var(--on-surface-variant)",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              style={{
                color: "var(--primary)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              S'inscrire
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-brand-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}

// ── Submit button (shared style) ──────────────────────────────────────────────

export function SubmitButton({
  loading,
  label,
  loadingLabel,
}: {
  loading: boolean;
  label: string;
  loadingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      style={{
        width: "100%",
        padding: "0.9375rem",
        backgroundColor: loading ? "var(--secondary)" : "var(--primary)",
        color: "var(--on-primary)",
        border: "none",
        borderRadius: "0.5rem",
        fontSize: "0.9375rem",
        fontFamily: "var(--font-manrope), sans-serif",
        fontWeight: 700,
        cursor: loading ? "not-allowed" : "pointer",
        transition: "background 0.18s, transform 0.1s",
        marginTop: "0.25rem",
        letterSpacing: "0.02em",
      }}
      onMouseEnter={(e) => {
        if (!loading)
          e.currentTarget.style.backgroundColor = "var(--primary-dim)";
      }}
      onMouseLeave={(e) => {
        if (!loading)
          e.currentTarget.style.backgroundColor = "var(--primary)";
      }}
      onMouseDown={(e) => {
        if (!loading) e.currentTarget.style.transform = "scale(0.985)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {loading ? loadingLabel : label}
    </button>
  );
}
