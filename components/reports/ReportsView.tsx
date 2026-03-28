"use client";

import { useState } from "react";
import { ApiMonthlyFlow, ApiCategorySplit, ApiBudget } from "@/lib/api";
import { Period, shortMonth, yearOf } from "@/lib/months";
import { formatMAD } from "@/lib/data";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EyebrowLabel from "@/components/ui/EyebrowLabel";
import SectionHeader from "@/components/ui/SectionHeader";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import CashFlowChart from "@/components/dashboard/CashFlowChart";
import CategoryChart from "@/components/dashboard/CategoryChart";
import KpiCard from "@/components/reports/KpiCard";

type Props = {
  monthlyFlow: ApiMonthlyFlow[];
  categorySplit: ApiCategorySplit[];
  budgets: ApiBudget[];
};

export default function ReportsView({ monthlyFlow, categorySplit, budgets }: Props) {
  const [period, setPeriod] = useState<Period>("6M");

  const sliced =
    period === "3M" ? monthlyFlow.slice(-3) :
    period === "6M" ? monthlyFlow.slice(-6) :
    monthlyFlow;

  const totalIncome = sliced.reduce((s, m) => s + parseFloat(m.income), 0);
  const totalExpenses = sliced.reduce((s, m) => s + parseFloat(m.expenses), 0);
  const netFlow = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((netFlow / totalIncome) * 100) : 0;

  const totalCategorySpend = categorySplit.reduce((s, c) => s + parseFloat(c.value), 0);
  const topCategories = [...categorySplit]
    .sort((a, b) => parseFloat(b.value) - parseFloat(a.value))
    .slice(0, 6);

  const reversedSliced = [...sliced].reverse();

  const budgetCount = budgets.length;
  const overBudgetCount = budgets.filter((b) => parseFloat(b.remaining) < 0).length;

  const periodLabel =
    period === "3M" ? "3 derniers mois" :
    period === "6M" ? "6 derniers mois" :
    "12 derniers mois";

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 min-w-0">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1
            style={{
              fontFamily: "var(--font-manrope), sans-serif",
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "var(--on-surface)",
              lineHeight: 1.1,
            }}
          >
            Rapports
          </h1>
          <p style={{ color: "var(--on-surface-variant)", marginTop: "0.375rem", fontSize: "0.875rem" }}>
            Analyse financière · {periodLabel}
          </p>
        </div>

        <div
          className="flex gap-1 p-1 rounded-2xl shadow-ambient"
          style={{ backgroundColor: "var(--surface-container-lowest)" }}
        >
          {(["3M", "6M", "1A"] as Period[]).map((p) => (
            <Button
              key={p}
              variant="ghost"
              size="sm"
              onClick={() => setPeriod(p)}
              style={{
                backgroundColor: period === p ? "var(--primary)" : "transparent",
                color: period === p ? "var(--on-primary)" : "var(--on-surface-variant)",
                padding: "6px 16px",
                borderRadius: "12px",
                fontSize: "0.8125rem",
                fontWeight: period === p ? 700 : 500,
                transition: "all 0.15s ease",
              }}
            >
              {p}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Revenus"
          value={`${formatMAD(totalIncome)} MAD`}
          accent="var(--primary)"
          trend="up"
          sub={`${sliced.length} mois`}
        />
        <KpiCard
          label="Dépenses"
          value={`${formatMAD(totalExpenses)} MAD`}
          accent="#e57373"
          trend="down"
          sub={`${sliced.length} mois`}
        />
        <KpiCard
          label="Flux Net"
          value={`${netFlow >= 0 ? "+" : ""}${formatMAD(netFlow)} MAD`}
          accent={netFlow >= 0 ? "var(--primary)" : "#e57373"}
          trend={netFlow >= 0 ? "up" : "down"}
          sub={netFlow >= 0 ? "Excédent" : "Déficit"}
          valueColor={netFlow >= 0 ? "var(--primary-dim)" : "#c62828"}
        />
        <KpiCard
          label="Taux d'Épargne"
          value={`${savingsRate}%`}
          accent="var(--tertiary)"
          trend={savingsRate >= 20 ? "up" : savingsRate >= 0 ? "neutral" : "down"}
          sub={savingsRate >= 20 ? "Excellent" : savingsRate >= 10 ? "Correct" : savingsRate >= 0 ? "Faible" : "Négatif"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <CashFlowChart data={monthlyFlow} />
        </div>
        <div>
          <CategoryChart data={categorySplit} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <Card padding="lg">
            <SectionHeader
              title="Détail Mensuel"
              subtitle="Revenus, dépenses et solde par mois"
              className="mb-6"
            />
            {sliced.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: "var(--on-surface-variant)" }}>
                Aucune donnée disponible
              </p>
            ) : (
              <div className="space-y-0">
                <div className="grid gap-4 px-4 pb-3" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr" }}>
                  <EyebrowLabel>Mois</EyebrowLabel>
                  <EyebrowLabel className="text-right">Revenus</EyebrowLabel>
                  <EyebrowLabel className="text-right">Dépenses</EyebrowLabel>
                  <EyebrowLabel className="text-right">Solde</EyebrowLabel>
                </div>
                {reversedSliced.map((m, i) => {
                  const income = parseFloat(m.income);
                  const expenses = parseFloat(m.expenses);
                  const net = income - expenses;
                  return (
                    <div
                      key={m.month}
                      className="grid gap-4 px-4 py-3 rounded-xl items-center"
                      style={{
                        gridTemplateColumns: "1fr 1fr 1fr 1fr",
                        backgroundColor: i % 2 === 0 ? "transparent" : "var(--surface-container-low)",
                      }}
                    >
                      <div>
                        <span style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: "0.875rem", fontWeight: 600, color: "var(--on-surface)" }}>
                          {shortMonth(m.month)}
                        </span>
                        <span className="ml-1" style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)" }}>
                          {yearOf(m.month)}
                        </span>
                      </div>
                      <div className="text-right font-numeric" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--primary-dim)" }}>
                        {formatMAD(income)}
                      </div>
                      <div className="text-right font-numeric" style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--on-surface-variant)" }}>
                        {formatMAD(expenses)}
                      </div>
                      <div className="text-right font-numeric" style={{ fontSize: "0.875rem", fontWeight: 700, color: net >= 0 ? "var(--primary)" : "#c62828" }}>
                        {net >= 0 ? "+" : ""}{formatMAD(net)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card padding="lg">
            <SectionHeader
              title="Par Catégorie"
              subtitle="Répartition des dépenses"
              className="mb-5"
            />
            {categorySplit.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: "var(--on-surface-variant)" }}>
                Aucune donnée
              </p>
            ) : (
              <div className="space-y-4">
                {topCategories.map((c) => {
                  const pct = totalCategorySpend > 0
                    ? Math.round((parseFloat(c.value) / totalCategorySpend) * 100)
                    : 0;
                  return (
                    <div key={c.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                          <span style={{ fontSize: "0.8125rem", color: "var(--on-surface)", fontWeight: 500 }}>
                            {c.name}
                          </span>
                        </div>
                        <span className="font-numeric" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--on-surface)" }}>
                          {pct}%
                        </span>
                      </div>
                      <ProgressBar value={pct} color={c.color} />
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {budgetCount > 0 && (
            <Card padding="lg">
              <SectionHeader
                title="Santé Budgétaire"
                subtitle="Budgets du mois en cours"
                className="mb-5"
              />
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="flex items-center justify-center rounded-2xl shrink-0"
                  style={{
                    width: 56,
                    height: 56,
                    backgroundColor: overBudgetCount > 0 ? "#fef2f2" : "var(--primary-container)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-manrope), sans-serif",
                      fontSize: "1.25rem",
                      fontWeight: 900,
                      color: overBudgetCount > 0 ? "#c62828" : "var(--primary)",
                    }}
                  >
                    {budgetCount - overBudgetCount}/{budgetCount}
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--on-surface)" }}>
                    {overBudgetCount === 0
                      ? "Tous les budgets respectés"
                      : `${overBudgetCount} dépassement${overBudgetCount > 1 ? "s" : ""}`}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", marginTop: 2 }}>
                    {budgetCount} budget{budgetCount > 1 ? "s" : ""} actif{budgetCount > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {budgets.slice(0, 4).map((b) => {
                  const pct = Math.min(b.utilization_pct, 100);
                  const over = parseFloat(b.remaining) < 0;
                  return (
                    <div key={b.id}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: b.category.color }} />
                          <span style={{ fontSize: "0.8125rem", color: "var(--on-surface)", fontWeight: 500 }}>
                            {b.category.name}
                          </span>
                        </div>
                        <Badge variant={over ? "error" : "primary"}>{pct}%</Badge>
                      </div>
                      <ProgressBar value={pct} color={over ? "#e57373" : b.category.color || "var(--primary)"} />
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

