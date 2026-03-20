"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import EyebrowLabel from "@/components/ui/EyebrowLabel";
import Button from "@/components/ui/Button";

const categories = ["Alimentation", "Loisirs", "Loyer", "Transport", "Santé", "Revenus", "Épargne"];
const accounts = ["Attijari Principal", "CIH Personnel", "Wafabourse"];

export default function QuickTransaction() {
  const [type, setType] = useState<"expense" | "income">("expense");

  return (
    <Card padding="md">
      <SectionHeader title="Transaction Rapide" className="mb-6" />

      <form className="space-y-4">
        {/* Amount */}
        <div>
          <EyebrowLabel className="mb-2 block">Montant (MAD)</EyebrowLabel>
          <input
            type="text"
            placeholder="0.00"
            className="w-full rounded-xl p-4 text-2xl font-black text-right outline-none font-numeric"
            style={{
              fontFamily: "var(--font-manrope), sans-serif",
              backgroundColor: "var(--surface-container-highest)",
              border: "none",
              color: "var(--on-surface)",
            }}
          />
        </div>

        {/* Type toggle */}
        <div className="grid grid-cols-2 gap-3">
          {(["expense", "income"] as const).map((t) => (
            <Button
              key={t}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setType(t)}
              style={{
                backgroundColor: type === t ? "var(--primary)" : "var(--surface-container-highest)",
                color: type === t ? "var(--on-primary)" : "var(--on-surface-variant)",
                borderRadius: "8px",
                width: "100%",
                justifyContent: "center",
              }}
            >
              {t === "expense" ? "Dépense" : "Revenu"}
            </Button>
          ))}
        </div>

        {/* Category */}
        <div>
          <EyebrowLabel className="mb-2 block">Catégorie</EyebrowLabel>
          <select
            className="w-full rounded-xl p-3 text-xs font-medium outline-none appearance-none"
            style={{ backgroundColor: "var(--surface-container-highest)", border: "none", color: "var(--on-surface)" }}
          >
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Account */}
        <div>
          <EyebrowLabel className="mb-2 block">Compte</EyebrowLabel>
          <select
            className="w-full rounded-xl p-3 text-xs font-medium outline-none appearance-none"
            style={{ backgroundColor: "var(--surface-container-highest)", border: "none", color: "var(--on-surface)" }}
          >
            {accounts.map((a) => <option key={a}>{a}</option>)}
          </select>
        </div>

        <Button type="submit" variant="primary" size="lg" style={{ width: "100%", justifyContent: "center", borderRadius: "1rem" }}>
          <Check size={15} strokeWidth={2.5} />
          Enregistrer l&apos;opération
        </Button>
      </form>
    </Card>
  );
}
