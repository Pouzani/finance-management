"use client";

import { useState } from "react";
import { Plus, X, ChevronDown, Loader2, Check } from "lucide-react";
import { ApiAccount, ApiCategory, createTransaction } from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import EyebrowLabel from "@/components/ui/EyebrowLabel";

type Props = {
  open: boolean;
  onClose: () => void;
  accounts: ApiAccount[];
  categories: ApiCategory[];
  onSuccess: () => void;
};

export default function AddTransactionDrawer({
  open, onClose, accounts, categories, onSuccess,
}: Props) {
  const [formType, setFormType] = useState<"expense" | "income">("expense");
  const [formLabel, setFormLabel] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formCategory, setFormCategory] = useState(
    categories.find((c) => c.type === "expense")?.id ?? ""
  );
  const [formAccount, setFormAccount] = useState(accounts[0]?.id ?? "");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const filteredCategories = categories.filter((c) => c.type === formType);

  function handleClose() {
    onClose();
    setFormError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const parsed = parseFloat(formAmount);
    if (!formAmount || isNaN(parsed) || parsed <= 0) {
      setFormError("Veuillez saisir un montant valide.");
      return;
    }
    if (!formLabel.trim()) {
      setFormError("Veuillez saisir un libellé.");
      return;
    }
    if (!formAccount) {
      setFormError("Veuillez sélectionner un compte.");
      return;
    }
    if (!formCategory) {
      setFormError("Veuillez sélectionner une catégorie.");
      return;
    }

    const signedAmount = formType === "expense" ? -Math.abs(parsed) : Math.abs(parsed);
    const today = new Date().toISOString().slice(0, 10);

    setSubmitting(true);
    try {
      await createTransaction({
        label: formLabel.trim(),
        amount: signedAmount.toFixed(2),
        date: today,
        type: formType,
        account: formAccount,
        category: formCategory,
      });
      setSuccess(true);
      setFormLabel("");
      setFormAmount("");
      setTimeout(() => {
        setSuccess(false);
        onClose();
        onSuccess();
      }, 1000);
    } catch (err) {
      const msg =
        typeof err === "object" && err !== null && "non_field_errors" in err
          ? (err as Record<string, string[]>).non_field_errors?.[0]
          : "Une erreur est survenue.";
      setFormError(msg ?? "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{
            backgroundColor: "rgba(43,52,55,0.28)",
            backdropFilter: "blur(3px)",
            WebkitBackdropFilter: "blur(3px)",
          }}
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Nouvelle transaction"
        className="fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: "420px",
          backgroundColor: "var(--surface-container-lowest)",
          boxShadow: open
            ? "-32px 0 80px rgba(43,52,55,0.12), -1px 0 0 rgba(227,233,236,0.5)"
            : "none",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.38s cubic-bezier(0.16,1,0.3,1)",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-7 py-6 shrink-0"
          style={{ borderBottom: "1px solid rgba(227,233,236,0.5)" }}
        >
          <div>
            <EyebrowLabel className="block mb-1">Saisie</EyebrowLabel>
            <h2
              style={{
                fontFamily: "var(--font-manrope), sans-serif",
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "var(--on-surface)",
                lineHeight: 1.2,
              }}
            >
              Nouvelle Transaction
            </h2>
          </div>
          <Button
            variant="ghost"
            onClick={handleClose}
            aria-label="Fermer"
            className="p-2 rounded-xl"
            style={{ color: "var(--on-surface-variant)" }}
          >
            <X size={18} />
          </Button>
        </div>

        {/* Form */}
        <form
          className="flex flex-col px-7 py-6 gap-5 flex-1"
          onSubmit={handleSubmit}
        >
          {/* Type toggle */}
          <div
            className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl"
            style={{ backgroundColor: "var(--surface-container)" }}
          >
            {(["expense", "income"] as const).map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={formType === t}
                onClick={() => {
                  setFormType(t);
                  setFormCategory(categories.find((c) => c.type === t)?.id ?? "");
                }}
                className="py-2.5 rounded-xl font-bold transition-all"
                style={{
                  fontSize: "12px",
                  fontFamily: "var(--font-manrope), sans-serif",
                  backgroundColor:
                    formType === t ? "var(--surface-container-lowest)" : "transparent",
                  color: formType === t ? "var(--on-surface)" : "var(--on-surface-variant)",
                  boxShadow: formType === t ? "0 2px 10px rgba(43,52,55,0.08)" : "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {t === "expense" ? "Dépense" : "Revenu"}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label
              htmlFor="drawer-amount"
              style={{ display: "block", marginBottom: "8px" }}
            >
              <EyebrowLabel>Montant</EyebrowLabel>
            </label>
            <div className="relative">
              <span
                className="absolute left-5 top-1/2 -translate-y-1/2 font-bold"
                style={{
                  fontSize: "11px",
                  color: "var(--on-surface-variant)",
                  fontFamily: "var(--font-manrope), sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                MAD
              </span>
              <Input
                id="drawer-amount"
                type="text"
                placeholder="0.00"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                className="w-full font-black text-right font-numeric"
                style={{
                  fontFamily: "var(--font-manrope), sans-serif",
                  border: "none",
                  fontSize: "30px",
                  padding: "20px 20px 20px 56px",
                  borderRadius: "1rem",
                }}
              />
            </div>
          </div>

          {/* Label */}
          <div>
            <label
              htmlFor="drawer-label"
              style={{ display: "block", marginBottom: "8px" }}
            >
              <EyebrowLabel>Libellé</EyebrowLabel>
            </label>
            <Input
              id="drawer-label"
              type="text"
              placeholder="Ex : Salaire, Loyer, Carrefour…"
              value={formLabel}
              onChange={(e) => setFormLabel(e.target.value)}
              className="w-full text-sm"
              style={{ border: "none", padding: "12px 16px" }}
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="drawer-category"
              style={{ display: "block", marginBottom: "8px" }}
            >
              <EyebrowLabel>Catégorie</EyebrowLabel>
            </label>
            <div className="relative">
              <select
                id="drawer-category"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm font-medium outline-none appearance-none"
                style={{
                  backgroundColor: "var(--surface-container)",
                  border: "none",
                  color: "var(--on-surface)",
                }}
              >
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--on-surface-variant)" }}
              />
            </div>
          </div>

          {/* Account */}
          <div>
            <label
              htmlFor="drawer-account"
              style={{ display: "block", marginBottom: "8px" }}
            >
              <EyebrowLabel>Compte</EyebrowLabel>
            </label>
            <div className="relative">
              <select
                id="drawer-account"
                value={formAccount}
                onChange={(e) => setFormAccount(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm font-medium outline-none appearance-none"
                style={{
                  backgroundColor: "var(--surface-container)",
                  border: "none",
                  color: "var(--on-surface)",
                }}
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--on-surface-variant)" }}
              />
            </div>
          </div>

          {/* Error */}
          {formError && (
            <p
              className="text-xs px-4 py-3 rounded-xl"
              role="alert"
              style={{ color: "var(--error)", backgroundColor: "var(--error-container)" }}
            >
              {formError}
            </p>
          )}

          {/* Submit */}
          <div className="mt-auto pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting || success}
              style={{
                width: "100%",
                justifyContent: "center",
                borderRadius: "1rem",
                gap: "8px",
                opacity: submitting || success ? 0.85 : 1,
              }}
            >
              {success ? (
                <>
                  <Check size={15} strokeWidth={2.5} />
                  Transaction enregistrée !
                </>
              ) : submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Enregistrement…
                </>
              ) : (
                <>
                  <Plus size={14} strokeWidth={2.5} />
                  Enregistrer l&apos;opération
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
