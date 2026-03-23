"use client";

import { useState } from "react";
import { X, Target } from "lucide-react";
import type { CreateGoalInput } from "@/lib/api";
import { GOAL_ICONS, GOAL_ICON_KEYS, DEFAULT_ICON_KEY } from "@/lib/goalIcons";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import EyebrowLabel from "@/components/ui/EyebrowLabel";

const PRESET_COLORS = [
  "#166969", "#0ea5e9", "#8b5cf6", "#f59e0b",
  "#ec4899", "#10b981", "#ef4444", "#6366f1",
];

type FormState = {
  label: string;
  target: string;
  current: string;
  iconKey: string;
  color: string;
};

const EMPTY_FORM: FormState = {
  label: "",
  target: "",
  current: "0",
  iconKey: DEFAULT_ICON_KEY,
  color: "#166969",
};

function calcPct(current: number, target: number): number {
  return target > 0 ? Math.round((current / target) * 100) : 0;
}

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (input: CreateGoalInput) => Promise<void>;
};

export default function AddGoalModal({ open, onClose, onCreate }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewDef = GOAL_ICONS[form.iconKey];
  const PreviewIcon = previewDef?.icon ?? Target;

  async function handleSubmit() {
    const target = parseFloat(form.target);
    const current = parseFloat(form.current);
    if (!form.label.trim() || isNaN(target) || target <= 0) return;
    setCreating(true);
    setError(null);
    try {
      await onCreate({
        label: form.label.trim(),
        target: target.toFixed(2),
        current: isNaN(current) ? "0.00" : current.toFixed(2),
        icon: form.iconKey,
        color: form.color,
      });
      setForm(EMPTY_FORM);
      onClose();
    } catch {
      setError("La création a échoué. Vérifiez les données et réessayez.");
    } finally {
      setCreating(false);
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
              <EyebrowLabel className="mb-1 block">Nouveau</EyebrowLabel>
              <h2
                style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: "1.25rem", fontWeight: 900, color: "var(--on-surface)" }}
              >
                Objectif d&apos;épargne
              </h2>
            </div>
            <Button variant="ghost" onClick={onClose} className="p-2 rounded-xl" style={{ color: "var(--on-surface-variant)" }}>
              <X size={18} />
            </Button>
          </div>

          <div className="mb-4">
            <EyebrowLabel className="mb-2 block">Icône</EyebrowLabel>
            <div className="flex flex-wrap gap-2">
              {GOAL_ICON_KEYS.map((key) => {
                const def = GOAL_ICONS[key];
                const Ic = def.icon;
                const isSelected = form.iconKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => setForm((s) => ({ ...s, iconKey: key }))}
                    title={def.label}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                    style={{
                      backgroundColor: isSelected ? `${form.color}20` : "var(--surface-container)",
                      border: isSelected ? `2px solid ${form.color}` : "2px solid transparent",
                      color: isSelected ? form.color : "var(--on-surface-variant)",
                      cursor: "pointer",
                    }}
                  >
                    <Ic size={16} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-4">
            <EyebrowLabel className="mb-2 block">Couleur</EyebrowLabel>
            <div className="flex gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setForm((s) => ({ ...s, color: c }))}
                  className="w-7 h-7 rounded-full transition-all"
                  style={{
                    backgroundColor: c,
                    border: form.color === c ? "3px solid var(--on-surface)" : "3px solid transparent",
                    cursor: "pointer",
                    outline: form.color === c ? "2px solid var(--surface-container-lowest)" : "none",
                    outlineOffset: "-4px",
                  }}
                  aria-label={`Couleur ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <EyebrowLabel className="mb-2 block">Nom de l&apos;objectif</EyebrowLabel>
            <Input
              type="text"
              value={form.label}
              onChange={(e) => setForm((s) => ({ ...s, label: e.target.value }))}
              placeholder="ex: Achat appartement"
              className="w-full"
              style={{ padding: "12px 16px" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div>
              <EyebrowLabel className="mb-2 block">Objectif (MAD)</EyebrowLabel>
              <Input
                type="text"
                value={form.target}
                onChange={(e) => setForm((s) => ({ ...s, target: e.target.value }))}
                placeholder="150 000"
                className="w-full font-numeric text-right"
                style={{ padding: "12px 16px", fontFamily: "var(--font-manrope), sans-serif", fontWeight: 700 }}
              />
            </div>
            <div>
              <EyebrowLabel className="mb-2 block">Déjà épargné (MAD)</EyebrowLabel>
              <Input
                type="text"
                value={form.current}
                onChange={(e) => setForm((s) => ({ ...s, current: e.target.value }))}
                placeholder="0"
                className="w-full font-numeric text-right"
                style={{ padding: "12px 16px", fontFamily: "var(--font-manrope), sans-serif", fontWeight: 700 }}
              />
            </div>
          </div>

          {form.label && form.target && (
            <div
              className="flex items-center gap-4 p-4 rounded-2xl mb-6"
              style={{ backgroundColor: `${form.color}10` }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: previewDef?.bg ?? "var(--primary-container)", color: previewDef?.color ?? "var(--on-primary-container)" }}
              >
                <PreviewIcon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-bold truncate"
                  style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: "14px", color: "var(--on-surface)" }}
                >
                  {form.label}
                </p>
                <p style={{ fontSize: "11px", color: "var(--on-surface-variant)" }}>
                  Objectif : {form.target} MAD
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs"
                style={{ backgroundColor: form.color, color: "#fff", fontFamily: "var(--font-manrope), sans-serif" }}
              >
                {`${calcPct(parseFloat(form.current || "0"), parseFloat(form.target))}%`}
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm mb-4 px-1" style={{ color: "var(--error)" }}>{error}</p>
          )}

          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            disabled={creating || !form.label.trim() || !form.target}
            className="w-full disabled:opacity-40"
            style={{ justifyContent: "center", letterSpacing: "0.04em" }}
          >
            {creating ? "Création…" : "Créer l'objectif"}
          </Button>
        </div>
      </div>
    </div>
  );
}
