"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Pencil, Check, X, AlertTriangle, TrendingDown } from "lucide-react";
import {
  ApiCategory,
  ApiBudget,
  createBudget,
  updateBudget,
  deleteBudget,
} from "@/lib/api";
import { formatMAD } from "@/lib/data";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import EyebrowLabel from "@/components/ui/EyebrowLabel";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import { CATEGORY_ICONS, DEFAULT_ICON } from "@/lib/categoryIcons";

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
  categories: ApiCategory[];
  budgets: ApiBudget[];
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function BudgetsView({ categories, budgets }: Props) {
  const t = useTranslations('budgets');
  const locale = useLocale();
  const router = useRouter();
  const [editState, setEditState] = useState<{ cat: ApiCategory; value: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editState) editInputRef.current?.focus();
  }, [editState]);

  // Map category id → budget for O(1) lookup
  const budgetByCatId = new Map(budgets.map((b) => [b.category.id, b]));

  // Month label — from current date (all categories share the same calendar month)
  const monthLabel = new Date().toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });

  // Aggregate totals from API data
  const totalBudget = budgets.reduce((s, b) => s + parseFloat(b.amount_limit), 0);
  const totalSpent = budgets.reduce((s, b) => s + parseFloat(b.spent), 0);
  const totalRemaining = budgets.reduce((s, b) => s + parseFloat(b.remaining), 0);
  const overallPct = totalBudget > 0
    ? Math.min(Math.round((totalSpent / totalBudget) * 100), 999)
    : 0;
  const overCount = budgets.filter((b) => parseFloat(b.remaining) < 0).length;
  const budgetsSet = budgets.length;

  // ── Budget mutations ──────────────────────────────────────────────────────

  function startEdit(cat: ApiCategory) {
    const existing = budgetByCatId.get(cat.id);
    setEditState({ cat, value: existing ? existing.amount_limit : "" });
  }

  async function commitEdit() {
    if (!editState) return;
    const val = parseFloat(editState.value);
    const existing = budgetByCatId.get(editState.cat.id);
    setSaving(true);
    try {
      if (isNaN(val) || val === 0) {
        if (existing) await deleteBudget(existing.id);
      } else if (existing) {
        await updateBudget(existing.id, { amount_limit: val.toFixed(2) });
      } else {
        await createBudget({
          category: editState.cat.id,
          amount_limit: val.toFixed(2),
          start_day: 1,
          rollover: false,
        });
      }
      router.refresh();
    } catch {
      // mutation failed — state will remain stale until next refresh
    } finally {
      setSaving(false);
      setEditState(null);
    }
  }

  function cancelEdit() {
    setEditState(null);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 overflow-y-auto">

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div className="px-8 pt-8 pb-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <EyebrowLabel className="mb-2 block">{t('eyebrow')}</EyebrowLabel>
            <h1
              style={{
                fontFamily: "var(--font-manrope), sans-serif",
                fontSize: "2rem",
                fontWeight: 900,
                color: "var(--on-surface)",
                lineHeight: 1.1,
              }}
            >
              {t('title')}
            </h1>
          </div>
          <div className="text-right">
            <EyebrowLabel>{monthLabel}</EyebrowLabel>
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
                <EyebrowLabel light className="mb-2 block">{t('budgetHealth')}</EyebrowLabel>
                {totalBudget === 0 ? (
                  <p
                    style={{
                      fontFamily: "var(--font-manrope), sans-serif",
                      fontSize: "1rem",
                      opacity: 0.7,
                      fontWeight: 500,
                    }}
                  >
                    {t('setLimits')}
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
                      {t('budgetUsed')}
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
                    {totalRemaining >= 0 ? t('available') : t('overspend')}
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
                    {formatMAD(totalSpent)} MAD {t('spent').toLowerCase()}
                  </span>
                  <span style={{ fontSize: "10px", opacity: 0.6 }}>
                    {formatMAD(totalBudget)} MAD {t('budget').toLowerCase()}
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
                label: t('totalBudget'),
                value: formatMAD(totalBudget),
                color: "var(--on-surface)",
              },
              {
                label: t('spentThisMonth'),
                value: formatMAD(totalSpent),
                color: "var(--error)",
              },
              {
                label: overCount > 0 ? t('overCount', { count: overCount }) : t('allOnTrack'),
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
            {t('configuredCount', { set: budgetsSet, total: categories.length })}
          </EyebrowLabel>
          {budgetsSet < categories.length && (
            <p style={{ fontSize: "10px", color: "var(--on-surface-variant)" }}>
              {t('clickToSet')}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {categories.map((cat, idx) => {
            const budget = budgetByCatId.get(cat.id);
            const hasLimit = !!budget;
            const limit = hasLimit ? parseFloat(budget.amount_limit) : 0;
            const catSpend = hasLimit ? parseFloat(budget.spent) : 0;
            const pct = hasLimit ? Math.min(Math.round(budget.utilization_pct), 999) : 0;
            const status = hasLimit
              ? pct >= 100 ? "over" : pct >= 80 ? "warning" : "good"
              : "unset";
            const iconDef = CATEGORY_ICONS[cat.name] ?? DEFAULT_ICON;
            const Icon = iconDef.icon;
            const barColor = status === "over" ? "var(--error)" : status === "warning" ? "#f59e0b" : "var(--primary)";
            const isEditing = editState?.cat.id === cat.id;
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
                      over: <Badge variant="error" className="shrink-0"><AlertTriangle size={9} className="mr-0.5" />{t('statusOver')}</Badge>,
                      warning: <Badge variant="custom" bg="rgba(245,158,11,0.15)" color="#b45309" className="shrink-0">{t('statusWarning')}</Badge>,
                      good: <Badge variant="primary" className="shrink-0">{t('statusGood')}</Badge>,
                      unset: <Badge variant="neutral" className="shrink-0">{t('statusUnset')}</Badge>,
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
                          {t('used', { pct })}
                        </span>
                        <span style={{ fontSize: "10px", color: "var(--on-surface-variant)" }}>
                          {parseFloat(budget.remaining) >= 0
                            ? t('remainingAmount', { amount: formatMAD(Math.abs(parseFloat(budget.remaining))) })
                            : t('overspentAmount', { amount: formatMAD(Math.abs(parseFloat(budget.remaining))) })}
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
                        {t('noBudgetHint')}
                      </p>
                    </div>
                  )}

                  {/* Amount rows */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span style={{ fontSize: "11px", color: "var(--on-surface-variant)" }}>
                        {t('spent')}
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
                        {t('budget')}
                      </span>
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <Input
                            ref={editInputRef}
                            type="text"
                            value={editState?.value ?? ""}
                            onChange={(e) => setEditState((s) => s ? { ...s, value: e.target.value } : s)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") commitEdit();
                              if (e.key === "Escape") cancelEdit();
                            }}
                            disabled={saving}
                            className="font-bold font-numeric text-right"
                            style={{
                              fontSize: "12px",
                              fontFamily: "var(--font-manrope), sans-serif",
                              width: "90px",
                              border: "2px solid rgba(22,105,105,0.20)",
                              opacity: saving ? 0.5 : 1,
                              padding: "4px 8px",
                            }}
                            aria-label={t('setBudgetFor', { name: cat.name })}
                          />
                          <Button
                            variant="ghost"
                            onClick={commitEdit}
                            disabled={saving}
                            aria-label={t('confirm')}
                            className="p-1 rounded-lg"
                            style={{ color: "var(--primary)" }}
                          >
                            <Check size={13} strokeWidth={2.5} />
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={cancelEdit}
                            disabled={saving}
                            aria-label={t('cancel')}
                            className="p-1 rounded-lg"
                            style={{ color: "var(--on-surface-variant)" }}
                          >
                            <X size={13} />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          onClick={() => startEdit(cat)}
                          className="flex items-center gap-1.5 group/edit"
                          aria-label={t('editBudgetFor', { name: cat.name })}
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
                              {t('setLimit')}
                            </span>
                          )}
                          <Pencil
                            size={10}
                            className="opacity-0 group-hover/edit:opacity-100 transition-opacity"
                            style={{ color: "var(--on-surface-variant)" }}
                          />
                        </Button>
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
              {t('noCategories')}
            </p>
            <p style={{ fontSize: "13px", color: "var(--on-surface-variant)" }}>
              {t('noCategoriesSub')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
