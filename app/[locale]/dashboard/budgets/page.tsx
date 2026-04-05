import { getCategories, getBudgets } from "@/lib/api";
import BudgetsView from "@/components/budgets/BudgetsView";

export default async function BudgetsPage() {
  const [categories, budgets] = await Promise.all([
    getCategories().catch(() => []),
    getBudgets().catch(() => []),
  ]);

  return (
    <BudgetsView
      categories={categories.filter((c) => c.type === "expense")}
      budgets={budgets}
    />
  );
}
