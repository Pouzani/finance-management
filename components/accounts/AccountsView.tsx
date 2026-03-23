"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";
import {
  ApiAccount,
  createAccount,
  updateAccount,
  deleteAccount,
  type CreateAccountInput,
} from "@/lib/api";
import { formatMAD } from "@/lib/data";
import Button from "@/components/ui/Button";
import EyebrowLabel from "@/components/ui/EyebrowLabel";
import Badge from "@/components/ui/Badge";
import AddAccountModal from "./AddAccountModal";

// ── Deterministic accent color from account id ────────────────────────────────

const ACCENT_COLORS = [
  "#166969", "#0ea5e9", "#8b5cf6", "#f59e0b",
  "#ec4899", "#10b981", "#6366f1", "#f97316",
];

function accentColor(id: string): string {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return ACCENT_COLORS[hash % ACCENT_COLORS.length];
}

// ── Component ─────────────────────────────────────────────────────────────────

type Props = { accounts: ApiAccount[] };

export default function AccountsView({ accounts }: Props) {
  const router = useRouter();
  const [modalState, setModalState] = useState<{ open: boolean; account: ApiAccount | null }>({
    open: false,
    account: null,
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { totalBalance, positiveCount } = accounts.reduce(
    (acc, a) => {
      const bal = parseFloat(a.balance);
      return {
        totalBalance:  acc.totalBalance + bal,
        positiveCount: acc.positiveCount + (bal >= 0 ? 1 : 0),
      };
    },
    { totalBalance: 0, positiveCount: 0 }
  );

  function openCreate() {
    setModalState({ open: true, account: null });
  }

  function openEdit(account: ApiAccount) {
    setModalState({ open: true, account });
  }

  function closeModal() {
    setModalState({ open: false, account: null });
  }

  async function handleSave(input: CreateAccountInput) {
    if (modalState.account) {
      await updateAccount(modalState.account.id, input);
    } else {
      await createAccount(input);
    }
    router.refresh();
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteAccount(id);
      router.refresh();
    } catch {
      // stale until next navigation
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div className="px-8 pt-8 pb-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <EyebrowLabel className="mb-2 block">Gestion financière</EyebrowLabel>
            <h1
              style={{
                fontFamily: "var(--font-manrope), sans-serif",
                fontSize: "2rem",
                fontWeight: 900,
                color: "var(--on-surface)",
                lineHeight: 1.1,
              }}
            >
              Comptes
            </h1>
          </div>
          <Button variant="primary" size="md" onClick={openCreate}>
            <Plus size={15} />
            Nouveau compte
          </Button>
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
                <EyebrowLabel light className="mb-2 block">Patrimoine total</EyebrowLabel>
                {accounts.length === 0 ? (
                  <p
                    style={{
                      fontFamily: "var(--font-manrope), sans-serif",
                      fontSize: "1rem",
                      opacity: 0.7,
                      fontWeight: 500,
                    }}
                  >
                    Ajoutez votre premier compte bancaire
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
                      {formatMAD(totalBalance)}
                    </span>
                    <span style={{ fontSize: "13px", opacity: 0.75, marginBottom: "10px" }}>
                      MAD
                    </span>
                  </div>
                )}
              </div>

              {accounts.length > 0 && (
                <div className="text-right">
                  <p
                    className="font-bold font-numeric"
                    style={{
                      fontFamily: "var(--font-manrope), sans-serif",
                      fontSize: "1.25rem",
                      color: "rgba(255,255,255,0.95)",
                    }}
                  >
                    {accounts.length}
                    <span style={{ fontSize: "10px", fontWeight: 500, marginLeft: "4px" }}>
                      compte{accounts.length > 1 ? "s" : ""}
                    </span>
                  </p>
                  <p style={{ fontSize: "11px", opacity: 0.65, marginTop: "2px" }}>actifs</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Summary chips ─────────────────────────────────────────────────── */}
        {accounts.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6 anim-enter anim-delay-1">
            {[
              {
                label: "Comptes actifs",
                value: accounts.length.toString(),
                color: "var(--on-surface)",
                isStatus: false,
              },
              {
                label: "Solde total",
                value: formatMAD(totalBalance),
                suffix: "MAD",
                color: totalBalance >= 0 ? "var(--primary)" : "var(--error)",
                isStatus: false,
              },
              {
                label: positiveCount === accounts.length ? "Tous en positif" : `${positiveCount} en positif`,
                value: positiveCount === accounts.length ? "✓" : `${positiveCount}/${accounts.length}`,
                color: positiveCount === accounts.length ? "var(--primary)" : "#f59e0b",
                isStatus: true,
              },
            ].map(({ label, value, suffix, color, isStatus }) => (
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
                  {suffix && <span style={{ fontSize: "9px", fontWeight: 500 }}>{suffix}</span>}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Accounts grid ────────────────────────────────────────────────────── */}
      <div className="px-8 pb-12">
        {accounts.length > 0 && (
          <EyebrowLabel className="mb-5 block">
            {accounts.length} compte{accounts.length > 1 ? "s" : ""} enregistré{accounts.length > 1 ? "s" : ""}
          </EyebrowLabel>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {accounts.map((account, idx) => {
            const color = accentColor(account.id);
            const balance = parseFloat(account.balance);
            const isNegative = balance < 0;
            const isDeleting = deletingId === account.id;
            const delayClass = `anim-delay-${Math.min(idx + 1, 6)}`;
            const createdDate = new Date(account.created_at).toLocaleDateString("fr-MA", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            return (
              <div
                key={account.id}
                className={`rounded-3xl shadow-ambient anim-enter ${delayClass} card-interactive overflow-hidden`}
                style={{
                  backgroundColor: "var(--surface-container-lowest)",
                  borderLeft: `3px solid ${color}`,
                  opacity: isDeleting ? 0.5 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm"
                        style={{
                          backgroundColor: `${color}18`,
                          color,
                          fontFamily: "var(--font-manrope), sans-serif",
                        }}
                      >
                        {account.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p
                          className="font-bold leading-tight"
                          style={{
                            fontFamily: "var(--font-manrope), sans-serif",
                            fontSize: "14px",
                            color: "var(--on-surface)",
                          }}
                        >
                          {account.name}
                        </p>
                        <p style={{ fontSize: "10px", color: "var(--on-surface-variant)", marginTop: "2px" }}>
                          Depuis {createdDate}
                        </p>
                      </div>
                    </div>

                    <Badge variant={isNegative ? "error" : "primary"} className="shrink-0">
                      {isNegative ? "Déficit" : "Actif"}
                    </Badge>
                  </div>

                  <div className="mb-5">
                    <EyebrowLabel className="mb-1 block">Solde disponible</EyebrowLabel>
                    <p
                      className="font-black font-numeric"
                      style={{
                        fontFamily: "var(--font-manrope), sans-serif",
                        fontSize: "2rem",
                        lineHeight: 1.1,
                        color: isNegative ? "var(--error)" : "var(--on-surface)",
                      }}
                    >
                      {isNegative ? "−" : ""}
                      {formatMAD(Math.abs(balance))}{" "}
                      <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--on-surface-variant)" }}>
                        MAD
                      </span>
                    </p>
                  </div>

                  <div
                    className="flex items-center gap-2 pt-4"
                    style={{ borderTop: "1px solid var(--surface-container)" }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(account)}
                      disabled={isDeleting}
                      className="flex items-center gap-1.5"
                      style={{ color: "var(--on-surface-variant)", fontSize: "12px" }}
                    >
                      <Pencil size={12} />
                      Modifier
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(account.id)}
                      disabled={isDeleting}
                      className="flex items-center gap-1.5 ml-auto"
                      style={{ color: "var(--error)", fontSize: "12px" }}
                    >
                      <Trash2 size={12} />
                      {isDeleting ? "Suppression…" : "Supprimer"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {accounts.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-24 text-center rounded-3xl anim-enter"
            style={{ backgroundColor: "var(--surface-container-lowest)" }}
          >
            <Building2 size={36} className="mb-4" style={{ color: "var(--outline-variant)" }} />
            <p
              className="font-bold mb-2"
              style={{
                fontFamily: "var(--font-manrope), sans-serif",
                fontSize: "1rem",
                color: "var(--on-surface)",
              }}
            >
              Aucun compte enregistré
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "var(--on-surface-variant)",
                marginBottom: "1.5rem",
              }}
            >
              Ajoutez vos comptes bancaires pour suivre votre patrimoine.
            </p>
            <Button variant="primary" size="md" onClick={openCreate}>
              <Plus size={15} />
              Ajouter un compte
            </Button>
          </div>
        )}
      </div>

      <AddAccountModal
        open={modalState.open}
        onClose={closeModal}
        onSave={handleSave}
        account={modalState.account}
      />
    </div>
  );
}
