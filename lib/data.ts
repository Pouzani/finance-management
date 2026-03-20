export type Transaction = {
  id: string;
  label: string;
  category: string;
  account: string;
  amount: number;
  date: string;
  type: "income" | "expense";
};

export type Goal = {
  id: string;
  label: string;
  current: number;
  target: number;
  icon: string;
  color: string;
};

export type MonthlyFlow = {
  month: string;
  income: number;
  expenses: number;
};

export type CategorySplit = {
  name: string;
  value: number;
  color: string;
};

export const transactions: Transaction[] = [
  { id: "1", label: "Salaire OCP", category: "Revenus", account: "CIH Principale", amount: 28500, date: "2026-03-01", type: "income" },
  { id: "2", label: "Loyer Appartement", category: "Logement", account: "CIH Principale", amount: -6500, date: "2026-03-02", type: "expense" },
  { id: "3", label: "Freelance Design", category: "Revenus", account: "Attijariwafa", amount: 14000, date: "2026-03-05", type: "income" },
  { id: "4", label: "Carrefour Market", category: "Alimentation", account: "CIH Principale", amount: -1240, date: "2026-03-07", type: "expense" },
  { id: "5", label: "Netflix", category: "Loisirs", account: "CIH Principale", amount: -120, date: "2026-03-08", type: "expense" },
  { id: "6", label: "Médecin", category: "Santé", account: "CIH Principale", amount: -350, date: "2026-03-10", type: "expense" },
  { id: "7", label: "Transfert Épargne", category: "Épargne", account: "Wafabourse", amount: -5000, date: "2026-03-12", type: "expense" },
  { id: "8", label: "Restaurant Dar Zitoun", category: "Alimentation", account: "CIH Principale", amount: -480, date: "2026-03-14", type: "expense" },
  { id: "9", label: "Dividendes", category: "Investissements", account: "Wafabourse", amount: 2500, date: "2026-03-15", type: "income" },
  { id: "10", label: "Essence Total", category: "Transport", account: "CIH Principale", amount: -680, date: "2026-03-17", type: "expense" },
];

export const goals: Goal[] = [
  { id: "1", label: "Voyage à Bali", current: 33750, target: 45000, icon: "✈", color: "#166969" },
  { id: "2", label: "Apport Immobilier", current: 54000, target: 450000, icon: "🏠", color: "#51616f" },
];

export const monthlyFlow: MonthlyFlow[] = [
  { month: "Oct", income: 38000, expenses: 15200 },
  { month: "Nov", income: 40500, expenses: 17800 },
  { month: "Déc", income: 45000, expenses: 22000 },
  { month: "Jan", income: 39000, expenses: 16500 },
  { month: "Fév", income: 41000, expenses: 18900 },
  { month: "Mar", income: 42500, expenses: 18240 },
];

export const categorySplit: CategorySplit[] = [
  { name: "Logement", value: 45, color: "#166969" },
  { name: "Alimentation", value: 25, color: "#4b6464" },
  { name: "Loisirs", value: 15, color: "#51616f" },
  { name: "Autres", value: 15, color: "#abb3b7" },
];

export function formatMAD(amount: number): string {
  const abs = Math.abs(amount);
  const formatted = new Intl.NumberFormat("fr-MA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(abs);
  return formatted;
}
