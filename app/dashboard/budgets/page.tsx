import { getCategories, getTransactions } from "@/lib/api";
import BudgetsView from "@/components/budgets/BudgetsView";

function getCurrentMonthRange() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
  return {
    start: `${year}-${month}-01`,
    end: `${year}-${month}-${String(lastDay).padStart(2, "0")}`,
    label: now.toLocaleDateString("fr-MA", { month: "long", year: "numeric" }),
  };
}

export default async function BudgetsPage() {
  const { start, end, label } = getCurrentMonthRange();

  const [categories, txPage] = await Promise.all([
    getCategories().catch(() => []),
    getTransactions({
      type: "expense",
      start_date: start,
      end_date: end,
      page: "1",
    }).catch(() => ({ count: 0, next: null, previous: null, results: [] })),
  ]);

  return (
    <BudgetsView
      categories={categories.filter((c) => c.type === "expense")}
      initialTransactions={txPage.results}
      initialTotal={txPage.count}
      monthStart={start}
      monthEnd={end}
      monthLabel={label}
    />
  );
}
