import {
  getAccounts,
  getCategories,
  getTransactions,
  getGoals,
  getMonthlyFlow,
  getCategorySplit,
} from "@/lib/api";
import BalanceSummary from "@/components/dashboard/BalanceSummary";
import CashFlowChart from "@/components/dashboard/CashFlowChart";
import CategoryChart from "@/components/dashboard/CategoryChart";
import TransactionTable from "@/components/dashboard/TransactionTable";
import QuickTransaction from "@/components/dashboard/QuickTransaction";
import GoalCards from "@/components/dashboard/GoalCards";

export default async function DashboardPage() {
  const [accounts, categories, txPage, goals, monthlyFlow, categorySplit] =
    await Promise.all([
      getAccounts().catch(() => []),
      getCategories().catch(() => []),
      getTransactions({ ordering: "-date" }).catch(() => ({ count: 0, next: null, previous: null, results: [] })),
      getGoals().catch(() => []),
      getMonthlyFlow().catch(() => []),
      getCategorySplit().catch(() => []),
    ]);

  const totalBalance = accounts.reduce(
    (sum, a) => sum + parseFloat(a.balance),
    0
  );

  const latestMonth = monthlyFlow[monthlyFlow.length - 1];
  const monthlyIncome = latestMonth ? parseFloat(latestMonth.income) : 0;
  const monthlyExpenses = latestMonth ? parseFloat(latestMonth.expenses) : 0;

  return (
    <div className="flex w-full min-h-full">
      {/* Main scrollable content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 min-w-0">
        {/* Balance hero */}
        <div className="anim-enter">
          <BalanceSummary
            totalBalance={totalBalance}
            monthlyIncome={monthlyIncome}
            monthlyExpenses={monthlyExpenses}
          />
        </div>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 anim-enter anim-delay-1">
          <div className="lg:col-span-2">
            <CashFlowChart data={monthlyFlow} />
          </div>
          <div>
            <CategoryChart data={categorySplit} />
          </div>
        </section>

        {/* Transactions */}
        <div className="anim-enter anim-delay-2">
          <TransactionTable transactions={txPage.results} />
        </div>
      </div>

      {/* Right panel */}
      <aside
        className="hidden xl:flex flex-col w-96 shrink-0 p-8 space-y-0 overflow-y-auto"
        style={{ backgroundColor: "var(--surface-container-low)" }}
      >
        <div className="anim-enter anim-delay-2">
          <QuickTransaction accounts={accounts} categories={categories} />
        </div>
        <div className="mt-8 anim-enter anim-delay-3">
          <GoalCards goals={goals} />
        </div>
      </aside>
    </div>
  );
}
