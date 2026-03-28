"use client";

import { useState } from "react";
import { ApiMonthlyFlow } from "@/lib/api";
import { Period, shortMonth } from "@/lib/months";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import EyebrowLabel from "@/components/ui/EyebrowLabel";
import Button from "@/components/ui/Button";

const periods = ["3M", "6M", "1A"] as const;

type Props = { data: ApiMonthlyFlow[] };

export default function CashFlowChart({ data }: Props) {
  const [period, setPeriod] = useState<Period>("6M");

  const sliced =
    period === "3M" ? data.slice(-3) :
    period === "6M" ? data.slice(-6) :
    data;

  const maxIncome = Math.max(...sliced.map((d) => parseFloat(d.income)), 1);

  const legend = (
    <div className="flex items-center gap-4">
      <div className="flex gap-3">
        <span className="flex items-center gap-1 font-bold uppercase" style={{ fontSize: "10px", color: "var(--primary)" }}>
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: "var(--primary)" }} />
          Revenus
        </span>
        <span className="flex items-center gap-1 font-bold uppercase" style={{ fontSize: "10px", color: "var(--on-surface-variant)" }}>
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: "#cbd5e1" }} />
          Dépenses
        </span>
      </div>
      <div className="flex gap-1">
        {periods.map((p) => (
          <Button
            key={p}
            variant="ghost"
            size="sm"
            onClick={() => setPeriod(p)}
            style={{
              backgroundColor: period === p ? "var(--primary-container)" : "transparent",
              color: period === p ? "var(--primary)" : "var(--on-surface-variant)",
              padding: "4px 10px",
              borderRadius: "8px",
            }}
          >
            {p}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <Card padding="lg">
      <SectionHeader
        title="Évolution des Flux"
        subtitle="Analyse comparative des flux mensuels"
        action={legend}
        className="mb-8"
      />

      {sliced.length === 0 ? (
        <div className="h-40 flex items-center justify-center" style={{ color: "var(--on-surface-variant)" }}>
          <p className="text-sm">Aucune donnée disponible</p>
        </div>
      ) : (
        <div className="h-40 flex items-end justify-between gap-4 px-4 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-full h-px" style={{ backgroundColor: "var(--surface-container-high)" }} />
            ))}
          </div>

          {sliced.map((d) => {
            const income = parseFloat(d.income);
            const expenses = parseFloat(d.expenses);
            const incomeH = Math.round((income / maxIncome) * 60);
            const expenseH = Math.round((expenses / maxIncome) * 60);
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div
                  className="w-full rounded-t-lg transition-colors"
                  style={{ height: `${expenseH}px`, backgroundColor: "#e2e8f0" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#cbd5e1"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#e2e8f0"; }}
                />
                <div
                  className="w-full rounded-t-lg transition-colors"
                  style={{ height: `${incomeH}px`, backgroundColor: "var(--primary-container)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--primary)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--primary-container)"; }}
                />
                <EyebrowLabel>{shortMonth(d.month)}</EyebrowLabel>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
