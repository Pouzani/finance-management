import BalanceSummary from "@/components/dashboard/BalanceSummary";
import CashFlowChart from "@/components/dashboard/CashFlowChart";
import CategoryChart from "@/components/dashboard/CategoryChart";
import TransactionTable from "@/components/dashboard/TransactionTable";
import QuickTransaction from "@/components/dashboard/QuickTransaction";
import GoalCards from "@/components/dashboard/GoalCards";

export default function DashboardPage() {
  return (
    <div className="flex w-full min-h-full">
      {/* Main scrollable content */}
      <div
        className="flex-1 overflow-y-auto p-8 space-y-8 min-w-0"
      >
        {/* Balance hero */}
        <BalanceSummary />

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CashFlowChart />
          </div>
          <div>
            <CategoryChart />
          </div>
        </section>

        {/* Transactions */}
        <TransactionTable />
      </div>

      {/* Right panel */}
      <aside
        className="hidden xl:flex flex-col w-96 shrink-0 p-8 space-y-0 overflow-y-auto"
        style={{ backgroundColor: "var(--surface-container-low)" }}
      >
        <QuickTransaction />
        <div className="mt-8">
          <GoalCards />
        </div>
      </aside>
    </div>
  );
}
