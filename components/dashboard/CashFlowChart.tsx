"use client";

import { useState } from "react";
import { monthlyFlow } from "@/lib/data";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import EyebrowLabel from "@/components/ui/EyebrowLabel";
import Button from "@/components/ui/Button";

const periods = ["3M", "6M", "1A"] as const;

export default function CashFlowChart() {
  const [period, setPeriod] = useState<"3M" | "6M" | "1A">("6M");
  const data = period === "3M" ? monthlyFlow.slice(-3) : monthlyFlow;
  const maxIncome = Math.max(...data.map((d) => d.income));

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
            onClick={() => setPeriod(p as typeof period)}
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
        subtitle="Analyse comparative des 6 derniers mois"
        action={legend}
        className="mb-8"
      />

      <div className="h-64 flex items-end justify-between gap-4 px-4 relative">
        <div className="absolute inset-x-0 top-0 h-full flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-full h-px" style={{ backgroundColor: "var(--surface-container-high)" }} />
          ))}
        </div>

        {data.map((d) => {
          const incomeH = Math.round((d.income / maxIncome) * 130);
          const expenseH = Math.round((d.expenses / maxIncome) * 130);
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
              <EyebrowLabel>{d.month.toUpperCase().slice(0, 3)}</EyebrowLabel>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
