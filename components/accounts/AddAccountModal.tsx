"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { ApiAccount, CreateAccountInput } from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import EyebrowLabel from "@/components/ui/EyebrowLabel";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (input: CreateAccountInput) => Promise<void>;
  account?: ApiAccount | null;
};

type FormState = {
  name: string;
  balance: string;
};

const EMPTY_FORM: FormState = { name: "", balance: "0" };

export default function AddAccountModal({ open, onClose, onSave, account }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!account;

  useEffect(() => {
    if (open) {
      setForm(account ? { name: account.name, balance: account.balance } : EMPTY_FORM);
      setError(null);
    }
  }, [open, account]);

  async function handleSubmit() {
    if (!form.name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await onSave({
        name: form.name.trim(),
        balance: parseFloat(form.balance || "0").toFixed(2),
      });
      onClose();
    } catch {
      setError("L'opération a échoué. Vérifiez les données et réessayez.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: "rgba(43,52,55,0.40)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-lift anim-enter"
        style={{ backgroundColor: "var(--surface-container-lowest)" }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <EyebrowLabel className="mb-1 block">{isEdit ? "Modifier" : "Nouveau"}</EyebrowLabel>
              <h2
                style={{
                  fontFamily: "var(--font-manrope), sans-serif",
                  fontSize: "1.25rem",
                  fontWeight: 900,
                  color: "var(--on-surface)",
                }}
              >
                {isEdit ? "Modifier le compte" : "Ajouter un compte"}
              </h2>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="p-2 rounded-xl"
              style={{ color: "var(--on-surface-variant)" }}
            >
              <X size={18} />
            </Button>
          </div>

          <div className="mb-4">
            <EyebrowLabel className="mb-2 block">Nom du compte</EyebrowLabel>
            <Input
              type="text"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              placeholder="ex: CIH Courant, BMCE Épargne"
              className="w-full"
              style={{ padding: "12px 16px" }}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            />
          </div>

          <div className="mb-6">
            <EyebrowLabel className="mb-2 block">
              {isEdit ? "Solde (MAD)" : "Solde initial (MAD)"}
            </EyebrowLabel>
            <Input
              type="text"
              value={form.balance}
              onChange={(e) => setForm((s) => ({ ...s, balance: e.target.value }))}
              placeholder="0"
              className="w-full font-numeric text-right"
              style={{
                padding: "12px 16px",
                fontFamily: "var(--font-manrope), sans-serif",
                fontWeight: 700,
              }}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            />
          </div>

          {error && (
            <p className="text-sm mb-4 px-1" style={{ color: "var(--error)" }}>
              {error}
            </p>
          )}

          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            loading={saving}
            disabled={saving || !form.name.trim()}
            className="w-full disabled:opacity-40"
            style={{ justifyContent: "center", letterSpacing: "0.04em" }}
          >
            {saving
              ? isEdit ? "Modification…" : "Création…"
              : isEdit ? "Enregistrer" : "Créer le compte"}
          </Button>
        </div>
      </div>
    </div>
  );
}
