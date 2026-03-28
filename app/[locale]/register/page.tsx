"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register, setTokens, extractErrorMessage } from "@/lib/auth";

// ── Shared input ──────────────────────────────────────────────────────────────

function AuthInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  hint,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  hint?: string;
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
      {hint && (
        <p
          style={{
            margin: "0.375rem 0 0",
            fontSize: "0.75rem",
            color: "var(--on-surface-variant)",
            fontFamily: "var(--font-inter), sans-serif",
            opacity: 0.7,
          }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

// ── Left branded panel ────────────────────────────────────────────────────────

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
          Rejoignez des milliers de Marocains qui gèrent leur patrimoine avec
          précision et sérénité.
        </p>
      </div>

      {/* Feature list */}
      <div className="anim-enter anim-delay-2" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {[
            { icon: "📊", text: "Tableaux de bord en temps réel" },
            { icon: "🎯", text: "Suivi des objectifs d'épargne" },
            { icon: "📋", text: "Gestion des budgets par catégorie" },
            { icon: "🔒", text: "Données sécurisées et privées" },
          ].map((feat) => (
            <div
              key={feat.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.875rem",
                backgroundColor: "rgba(166,239,239,0.07)",
                borderRadius: "0.75rem",
                padding: "0.75rem 1rem",
              }}
            >
              <span style={{ fontSize: "1.125rem" }}>{feat.icon}</span>
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.82)",
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                {feat.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function set(field: keyof typeof form) {
    return (value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.password2) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    try {
      const tokens = await register(form);
      setTokens(tokens.access, tokens.refresh);
      router.push("/dashboard");
    } catch (err) {
      setError(extractErrorMessage(err, "Erreur lors de la création du compte"));
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
      {/* Left branded panel */}
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
          overflowY: "auto",
        }}
      >
        <div
          className="anim-enter"
          style={{ width: "100%", maxWidth: "420px", paddingBlock: "1rem" }}
        >
          {/* Icon + heading */}
          <div style={{ marginBottom: "2.25rem" }}>
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
                  d="M9 3v12M3 9h12"
                  stroke="white"
                  strokeWidth="1.8"
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
              Créer un compte
            </h2>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.9rem",
                color: "var(--on-surface-variant)",
                margin: 0,
              }}
            >
              Rejoignez Le Grand Livre gratuitement
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
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
              value={form.username}
              onChange={set("username")}
              placeholder="votre_nom"
              required
            />

            <AuthInput
              label="Adresse e-mail"
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="vous@exemple.ma"
              required
            />

            <AuthInput
              label="Mot de passe"
              type="password"
              value={form.password}
              onChange={set("password")}
              placeholder="••••••••"
              required
              hint="8 caractères minimum"
            />

            <AuthInput
              label="Confirmer le mot de passe"
              type="password"
              value={form.password2}
              onChange={set("password2")}
              placeholder="••••••••"
              required
            />

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
              {loading ? "Création du compte…" : "Créer mon compte"}
            </button>
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
            Déjà un compte ?{" "}
            <Link
              href="/login"
              style={{
                color: "var(--primary)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Se connecter
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
