"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { ApiAccount, ApiCategory, createTransaction } from "@/lib/api";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import EyebrowLabel from "@/components/ui/EyebrowLabel";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type Props = {
  accounts: ApiAccount[];
  categories: ApiCategory[];
};

export default function QuickTransaction({ accounts, categories }: Props) {
  const router = useRouter();
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [label, setLabel] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const filteredCategories = categories.filter((c) => c.type === type);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      setError("Veuillez saisir un montant valide.");
      return;
    }
    if (!label.trim()) {
      setError("Veuillez saisir un libellé.");
      return;
    }
    if (!accountId) {
      setError("Veuillez sélectionner un compte.");
      return;
    }
    if (!categoryId) {
      setError("Veuillez sélectionner une catégorie.");
      return;
    }

    const signedAmount = type === "expense" ? -Math.abs(parsed) : Math.abs(parsed);
    const today = new Date().toISOString().slice(0, 10);

    setSubmitting(true);
    try {
      await createTransaction({
        label: label.trim(),
        amount: signedAmount.toFixed(2),
        date: today,
        type,
        account: accountId,
        category: categoryId,
      });
      setAmount("");
      setLabel("");
      router.refresh();
    } catch (err) {
      const msg =
        typeof err === "object" && err !== null && "non_field_errors" in err
          ? (err as Record<string, string[]>).non_field_errors?.[0]
          : "Une erreur est survenue.";
      setError(msg ?? "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card padding="md">
      <SectionHeader title="Transaction Rapide" className="mb-6" />

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Label */}
        <div>
          <EyebrowLabel className="mb-2 block">Libellé</EyebrowLabel>
          <Input
            type="text"
            placeholder="Ex: Loyer, Salaire…"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full text-sm"
            style={{ backgroundColor: "var(--surface-container-highest)", border: "none", padding: "12px" }}
          />
        </div>

        {/* Amount */}
        <div>
          <EyebrowLabel className="mb-2 block">Montant (MAD)</EyebrowLabel>
          <Input
            type="text"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full font-black text-right font-numeric"
            style={{
              fontFamily: "var(--font-manrope), sans-serif",
              backgroundColor: "var(--surface-container-highest)",
              border: "none",
              fontSize: "24px",
              padding: "16px",
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
              onClick={() => {
                setType(t);
                setCategoryId(categories.find((c) => c.type === t)?.id ?? "");
              }}
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
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-xl p-3 text-xs font-medium outline-none appearance-none"
            style={{ backgroundColor: "var(--surface-container-highest)", border: "none", color: "var(--on-surface)" }}
          >
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Account */}
        <div>
          <EyebrowLabel className="mb-2 block">Compte</EyebrowLabel>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full rounded-xl p-3 text-xs font-medium outline-none appearance-none"
            style={{ backgroundColor: "var(--surface-container-highest)", border: "none", color: "var(--on-surface)" }}
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-xs" style={{ color: "var(--error)" }}>{error}</p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          style={{ width: "100%", justifyContent: "center", borderRadius: "1rem" }}
        >
          {submitting ? (
            <span>Enregistrement…</span>
          ) : (
            <>
              <Check size={15} strokeWidth={2.5} />
              Enregistrer l&apos;opération
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
