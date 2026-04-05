// Legacy types kept for backward compatibility with tests
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

export function formatDateLabel(dateStr: string, locale = 'en'): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(locale, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

export function formatMAD(amount: number): string {
  const abs = Math.abs(amount);
  const formatted = new Intl.NumberFormat("fr-MA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(abs);
  return formatted;
}
