import { getMonthlyFlow, getCategorySplit, getBudgets } from "@/lib/api";
import ReportsView from "@/components/reports/ReportsView";

export default async function ReportsPage() {
  const [monthlyFlow, categorySplit, budgets] = await Promise.all([
    getMonthlyFlow().catch(() => []),
    getCategorySplit().catch(() => []),
    getBudgets().catch(() => []),
  ]);

  return (
    <div className="flex w-full min-h-full">
      <ReportsView
        monthlyFlow={monthlyFlow}
        categorySplit={categorySplit}
        budgets={budgets}
      />
    </div>
  );
}
