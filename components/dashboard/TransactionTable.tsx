"use client";

import { ApiTransaction } from "@/lib/api";
import { formatMAD } from "@/lib/data";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import IconBox from "@/components/ui/IconBox";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EyebrowLabel from "@/components/ui/EyebrowLabel";
import { CATEGORY_ICONS as categoryIcons, DEFAULT_ICON } from "@/lib/categoryIcons";

type Props = { transactions: ApiTransaction[] };

export default function TransactionTable({ transactions }: Props) {
  return (
    <Card padding="none" overflow>
      <div className="p-8">
        <SectionHeader
          title="Dernières Opérations"
          action={<Button variant="link">Voir tout l&apos;historique</Button>}
        />
      </div>

      {transactions.length === 0 ? (
        <div className="px-8 pb-8 text-center" style={{ color: "var(--on-surface-variant)" }}>
          <p className="text-sm">Aucune transaction pour le moment.</p>
        </div>
      ) : (
        <table className="w-full text-left">
          <thead style={{ backgroundColor: "var(--surface-container-low)" }}>
            <tr>
              {["Transaction", "Catégorie", "Compte", "Montant", "Action"].map((h, i) => (
                <th key={h} className={`px-8 py-4 ${i === 3 ? "text-right" : i === 4 ? "text-center" : ""}`}>
                  <EyebrowLabel>{h}</EyebrowLabel>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const categoryName = tx.category_detail?.name ?? "";
              const cat = categoryIcons[categoryName] ?? DEFAULT_ICON;
              const Icon = cat.icon;
              const amount = Math.abs(parseFloat(tx.amount));
              return (
                <tr
                  key={tx.id}
                  className="group transition-colors"
                  style={{ borderTop: "1px solid rgba(227,233,236,0.3)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(241,244,246,0.5)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <IconBox bg={cat.bg} color={cat.color} size="lg" shape="rounded-xl">
                        <Icon size={16} />
                      </IconBox>
                      <div>
                        <p className="text-sm font-bold" style={{ color: "var(--on-surface)" }}>{tx.label}</p>
                        <p style={{ fontSize: "10px", color: "var(--on-surface-variant)" }}>{tx.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <Badge variant="neutral">{categoryName || "—"}</Badge>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-medium" style={{ color: "var(--on-surface-variant)" }}>{tx.account_name}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span
                      className="font-bold text-sm font-numeric"
                      style={{ fontFamily: "var(--font-manrope), sans-serif", color: tx.type === "income" ? "var(--primary)" : "var(--error)" }}
                    >
                      {tx.type === "income" ? "+ " : "- "}{formatMAD(amount)}{" "}
                      <span className="font-normal" style={{ fontSize: "10px" }}>MAD</span>
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" style={{ color: "var(--on-surface-variant)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </Card>
  );
}
