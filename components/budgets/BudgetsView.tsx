"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Pencil, Check, X, AlertTriangle, TrendingDown } from "lucide-react";
import { ApiCategory, ApiTransaction, getTransactions } from "@/lib/api";
import { formatMAD } from "@/lib/data";
import EyebrowLabel from "@/components/ui/EyebrowLabel";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import { CATEGORY_ICONS, DEFAULT_ICON } from "@/lib/categoryIcons";

// ── Constants ────────────────────────────────────────────────────────────────

const BUDGET_KEY = "finance-budgets-v1";

type BudgetMap = Record<string, number>; // category name → MAD limit

// ── Helpers ───────────────────────────────────────────────────────────────────

function computeSpend(txs: ApiTransaction[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const tx of txs) {
    const name = tx.category_detail?.name ?? "";
    if (name) result[name] = (result[name] ?? 0) + Math.abs(parseFloat(tx.amount));
  }
  return result;
}

function healthColor(pct: number): string {
  if (pct >= 100) return "var(--error)";
  if (pct >= 80) return "#f59e0b";
  return "var(--primary)";
}

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
  categories: ApiCategory[];
  initialTransactions: ApiTransaction[];
  initialTotal: number;
  monthStart: string;
  monthEnd: string;
  monthLabel: string;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function BudgetsView({
  categories,
  initialTransactions,
  initialTotal,
  monthStart,
  monthEnd,
  monthLabel,
}: Props) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [loadingMore, setLoadingMore] = useState(
    initialTotal > initialTransactions.length
  );
  const [budgets, setBudgets] = useState<BudgetMap>({});
  const [editState, setEditState] = useState<{ cat: string; value: string } | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const initialTxRef = useRef(initialTransactions);

  // Load budgets from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(BUDGET_KEY);
      if (raw) setBudgets(JSON.parse(raw) as BudgetMap);
    } catch {}
  }, []);

  // Fetch remaining transaction pages if needed
  useEffect(() => {
    if (initialTotal <= initialTxRef.current.length) return;
    let cancelled = false;
    async function fetchRemaining() {
      const all = [...initialTxRef.current];
      let p = 2;
      while (!cancelled) {
        const result = await getTransactions({
          type: "expense",
          start_date: monthStart,
          end_date: monthEnd,
          page: String(p),
        }).catch(() => null);
        if (!result || !result.results.length) break;
        all.push(...result.results);
        if (!result.next) break;
        p++;
      }
      if (!cancelled) {
        setTransactions(all);
        setLoadingMore(false);
      }
    }
    fetchRemaining();
    return () => { cancelled = true; };
  }, [initialTotal, monthStart, monthEnd]);

  // Focus edit input when it opens
  useEffect(() => {
    if (editState) editInputRef.current?.focus();
  }, [editState]);

  // ── Budget mutations ──────────────────────────────────────────────────────

  function saveBudget(catName: string, value: number) {
    const next = { ...budgets, [catName]: value };
    setBudgets(next);
    localStorage.setItem(BUDGET_KEY, JSON.stringify(next));
  }

  function startEdit(catName: string) {
    setEditState({ cat: catName, value: budgets[catName] ? String(budgets[catName]) : "" });
  }

  function commitEdit(catName: string) {
    const val = parseFloat(editState?.value ?? "");
    if (!isNaN(val) && val >= 0) saveBudget(catName, val);
    setEditState(null);
  }

  function cancelEdit() {
    setEditState(null);
  }

  // ── Computed values ───────────────────────────────────────────────────────

  const spend = useMemo(() => computeSpend(transactions), [transactions]);

  const totalBudget = categories.reduce(
    (s, c) => s + (budgets[c.name] ?? 0), 0
  );
  const totalSpent = categories.reduce(
    (s, c) => s + (spend[c.name] ?? 0), 0
  );
  const totalRemaining = totalBudget - totalSpent;
  const overallPct = totalBudget > 0
    ? Math.min(Math.round((totalSpent / totalBudget) * 100), 999)
    : 0;
  const overCount = categories.filter(
    (c) => budgets[c.name] && spend[c.name] > budgets[c.name]
  ).length;
  const budgetsSet = categories.filter((c) => budgets[c.name] > 0).length;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 overflow-y-auto">

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div className="px-8 pt-8 pb-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <EyebrowLabel className="mb-2 block">Planification</EyebrowLabel>
            <h1
              style={{
                fontFamily: "var(--font-manrope), sans-serif",
                fontSize: "2rem",
                fontWeight: 900,
                color: "var(--on-surface)",
                lineHeight: 1.1,
              }}
            >
              Budgets
            </h1>
          </div>
          <div className="text-right">
            <EyebrowLabel>{monthLabel}</EyebrowLabel>
            {loadingMore && (
              <p style={{ fontSize: "10px", color: "var(--on-surface-variant)", marginTop: "4px" }}>
                Calcul en cours…
              </p>
            )}
          </div>
        </div>

        {/* ── Hero card ──────────────────────────────────────────────────────── */}
        <div
          className="hero-card rounded-3xl p-8 mb-6 anim-enter"
          style={{ color: "var(--on-primary)", minHeight: "180px" }}
        >
          <div className="grain-overlay" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <EyebrowLabel light className="mb-2 block">Santé budgétaire</EyebrowLabel>
                {totalBudget === 0 ? (
                  <p
                    style={{
                      fontFamily: "var(--font-manrope), sans-serif",
                      fontSize: "1rem",
                      opacity: 0.7,
                      fontWeight: 500,
                    }}
                  >
                    Définissez vos limites par catégorie ci-dessous
                  </p>
                ) : (
                  <div className="flex items-end gap-3">
                    <span
                      className="font-numeric font-black"
                      style={{
                        fontFamily: "var(--font-manrope), sans-serif",
                        fontSize: "3.5rem",
                        lineHeight: 1,
                      }}
                    >
                      {overallPct}%
                    </span>
                    <span style={{ fontSize: "13px", opacity: 0.75, marginBottom: "8px" }}>
                      du budget utilisé
                    </span>
                  </div>
                )}
              </div>

              {totalBudget > 0 && (
                <div className="text-right">
                  <p
                    className="font-bold font-numeric"
                    style={{
                      fontFamily: "var(--font-manrope), sans-serif",
                      fontSize: "1.25rem",
                      color: totalRemaining >= 0 ? "rgba(255,255,255,0.95)" : "#fca5a5",
                    }}
                  >
                    {totalRemaining >= 0 ? "+" : "−"}{" "}
                    {formatMAD(Math.abs(totalRemaining))}{" "}
                    <span style={{ fontSize: "10px", fontWeight: 500 }}>MAD</span>
                  </p>
                  <p style={{ fontSize: "11px", opacity: 0.65, marginTop: "2px" }}>
                    {totalRemaining >= 0 ? "disponibles" : "dépassement"}
                  </p>
                </div>
              )}
            </div>

            {totalBudget > 0 && (
              <div>
                <ProgressBar
                  value={Math.min(overallPct, 100)}
                  color={overallPct >= 100 ? "#fca5a5" : overallPct >= 80 ? "#fcd34d" : "rgba(255,255,255,0.85)"}
                  trackColor="rgba(255,255,255,0.20)"
                  className="mb-2"
                />
                <div className="flex justify-between">
                  <span style={{ fontSize: "10px", opacity: 0.6 }}>
                    {formatMAD(totalSpent)} MAD dépensés
                  </span>
                  <span style={{ fontSize: "10px", opacity: 0.6 }}>
                    {formatMAD(totalBudget)} MAD budgétés
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Summary chips ─────────────────────────────────────────────────── */}
        {totalBudget > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6 anim-enter anim-delay-1">
            {[
              {
                label: "Budget total",
                value: formatMAD(totalBudget),
                color: "var(--on-surface)",
              },
              {
                label: "Dépensé ce mois",
                value: formatMAD(totalSpent),
                color: "var(--error)",
              },
              {
                label: overCount > 0 ? `${overCount} dépassement${overCount > 1 ? "s" : ""}` : "Tout en ordre",
                value: overCount > 0 ? "⚠" : "✓",
                color: overCount > 0 ? "#f59e0b" : "var(--primary)",
                isStatus: true,
              },
            ].map(({ label, value, color, isStatus }) => (
              <div
                key={label}
                className="rounded-2xl p-4"
                style={{
                  backgroundColor: "var(--surface-container-lowest)",
                  boxShadow: "0px 4px 16px rgba(43,52,55,0.05)",
                }}
              >
                <EyebrowLabel className="mb-2 block">{label}</EyebrowLabel>
                <p
                  className="font-bold font-numeric leading-none"
                  style={{
                    fontFamily: "var(--font-manrope), sans-serif",
                    fontSize: isStatus ? "1.5rem" : "1.15rem",
                    color,
                  }}
                >
                  {value}{" "}
                  {!isStatus && (
                    <span style={{ fontSize: "9px", fontWeight: 500 }}>MAD</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Category grid ────────────────────────────────────────────────────── */}
      <div className="px-8 pb-12">
        <div className="flex items-center justify-between mb-5">
          <EyebrowLabel>
            Catégories — {budgetsSet}/{categories.length} configurées
          </EyebrowLabel>
          {budgetsSet < categories.length && (
            <p style={{ fontSize: "10px", color: "var(--on-surface-variant)" }}>
              Cliquez sur le montant pour définir un budget
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {categories.map((cat, idx) => {
            const catSpend = spend[cat.name] ?? 0;
            const limit = budgets[cat.name] ?? 0;
            const hasLimit = limit > 0;
            const pct = hasLimit ? Math.min(Math.round((catSpend / limit) * 100), 999) : 0;
            const status = hasLimit
              ? pct >= 100 ? "over" : pct >= 80 ? "warning" : "good"
              : "unset";
            const iconDef = CATEGORY_ICONS[cat.name] ?? DEFAULT_ICON;
            const Icon = iconDef.icon;
            const barColor = status === "over" ? "var(--error)" : status === "warning" ? "#f59e0b" : "var(--primary)";
            const isEditing = editState?.cat === cat.name;
            const delayClass = `anim-delay-${Math.min(idx + 1, 6)}`;

            return (
              <div
                key={cat.id}
                className={`rounded-3xl shadow-ambient anim-enter ${delayClass} overflow-hidden`}
                style={{
                  backgroundColor: "var(--surface-container-lowest)",
                  borderLeft: hasLimit
                    ? `3px solid ${cat.color || barColor}`
                    : "3px dashed var(--outline-variant)",
                }}
              >
                <div className="p-6">
                  {/* Card header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: iconDef.bg, color: iconDef.color }}
                      >
                        <Icon size={16} />
                      </div>
                      <p
                        className="font-bold"
                        style={{
                          fontFamily: "var(--font-manrope), sans-serif",
                          fontSize: "14px",
                          color: "var(--on-surface)",
                        }}
                      >
                        {cat.name}
                      </p>
                    </div>

                    {/* Status badge */}
                    {{
                      over: <Badge variant="error" className="shrink-0"><AlertTriangle size={9} className="mr-0.5" />Dépassé</Badge>,
                      warning: <Badge variant="custom" bg="rgba(245,158,11,0.15)" color="#b45309" className="shrink-0">Attention</Badge>,
                      good: <Badge variant="primary" className="shrink-0">En ordre</Badge>,
                      unset: <Badge variant="neutral" className="shrink-0">Non défini</Badge>,
                    }[status]}
                  </div>

                  {/* Progress */}
                  {hasLimit && (
                    <div className="mb-4">
                      <div className="flex justify-between mb-1.5">
                        <span
                          className="font-bold font-numeric"
                          style={{
                            fontSize: "10px",
                            color: barColor,
                            fontFamily: "var(--font-manrope), sans-serif",
                          }}
                        >
                          {pct}% utilisé
                        </span>
                        <span style={{ fontSize: "10px", color: "var(--on-surface-variant)" }}>
                          {formatMAD(limit - catSpend)} MAD{" "}
                          {catSpend <= limit ? "restants" : "dépassés"}
                        </span>
                      </div>
                      <ProgressBar value={pct} color={barColor} />
                    </div>
                  )}

                  {!hasLimit && catSpend > 0 && (
                    <div className="mb-4">
                      <ProgressBar value={0} />
                      <p
                        className="mt-1.5"
                        style={{ fontSize: "10px", color: "var(--on-surface-variant)" }}
                      >
                        Définissez un budget pour suivre vos dépenses
                      </p>
                    </div>
                  )}

                  {/* Amount rows */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span style={{ fontSize: "11px", color: "var(--on-surface-variant)" }}>
                        Dépensé
                      </span>
                      <span
                        className="font-bold font-numeric"
                        style={{
                          fontSize: "12px",
                          fontFamily: "var(--font-manrope), sans-serif",
                          color: catSpend > 0 ? "var(--error)" : "var(--on-surface-variant)",
                        }}
                      >
                        {catSpend > 0 ? `${formatMAD(catSpend)} MAD` : "—"}
                      </span>
                    </div>

                    {/* Budget limit — editable */}
                    <div className="flex justify-between items-center">
                      <span style={{ fontSize: "11px", color: "var(--on-surface-variant)" }}>
                        Budget
                      </span>
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            ref={editInputRef}
                            type="text"
                            value={editState?.value ?? ""}
                            onChange={(e) => setEditState((s) => s ? { ...s, value: e.target.value } : s)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") commitEdit(cat.name);
                              if (e.key === "Escape") cancelEdit();
                            }}
                            className="rounded-lg px-2 py-1 text-right font-bold font-numeric outline-none"
                            style={{
                              fontSize: "12px",
                              fontFamily: "var(--font-manrope), sans-serif",
                              width: "90px",
                              backgroundColor: "var(--surface-container)",
                              color: "var(--on-surface)",
                              border: "2px solid rgba(22,105,105,0.20)",
                            }}
                            aria-label={`Budget pour ${cat.name} en MAD`}
                          />
                          <button
                            onClick={() => commitEdit(cat.name)}
                            aria-label="Confirmer"
                            className="p-1 rounded-lg"
                            style={{ color: "var(--primary)", background: "none", border: "none", cursor: "pointer" }}
                          >
                            <Check size={13} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            aria-label="Annuler"
                            className="p-1 rounded-lg"
                            style={{ color: "var(--on-surface-variant)", background: "none", border: "none", cursor: "pointer" }}
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(cat.name)}
                          className="flex items-center gap-1.5 group/edit"
                          style={{ background: "none", border: "none", cursor: "pointer" }}
                          aria-label={`Modifier le budget pour ${cat.name}`}
                        >
                          {hasLimit ? (
                            <span
                              className="font-bold font-numeric"
                              style={{
                                fontSize: "12px",
                                fontFamily: "var(--font-manrope), sans-serif",
                                color: "var(--on-surface)",
                              }}
                            >
                              {formatMAD(limit)} MAD
                            </span>
                          ) : (
                            <span
                              style={{
                                fontSize: "11px",
                                color: "var(--primary)",
                                fontFamily: "var(--font-manrope), sans-serif",
                                fontWeight: 700,
                              }}
                            >
                              Définir →
                            </span>
                          )}
                          <Pencil
                            size={10}
                            className="opacity-0 group-hover/edit:opacity-100 transition-opacity"
                            style={{ color: "var(--on-surface-variant)" }}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {categories.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-24 text-center rounded-3xl"
            style={{ backgroundColor: "var(--surface-container-lowest)" }}
          >
            <TrendingDown size={32} className="mb-4" style={{ color: "var(--on-surface-variant)" }} />
            <p
              className="font-bold mb-2"
              style={{
                fontFamily: "var(--font-manrope), sans-serif",
                fontSize: "1rem",
                color: "var(--on-surface)",
              }}
            >
              Aucune catégorie de dépenses
            </p>
            <p style={{ fontSize: "13px", color: "var(--on-surface-variant)" }}>
              Ajoutez des catégories via l&apos;API pour commencer à budgétiser.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
