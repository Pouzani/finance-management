import { formatMAD } from "@/lib/data";
import Badge from "@/components/ui/Badge";
import MetricCard from "@/components/ui/MetricCard";
import EyebrowLabel from "@/components/ui/EyebrowLabel";

type Props = {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  totalSaved: number;
  totalTarget: number;
};

export default function BalanceSummary({ totalBalance, monthlyIncome, monthlyExpenses, totalSaved, totalTarget }: Props) {
  const savingsPct = totalTarget > 0 ? Math.min(Math.round((totalSaved / totalTarget) * 100), 100) : 0;
  const expensesPct = monthlyIncome > 0 ? Math.min(Math.round((monthlyExpenses / monthlyIncome) * 100), 100) : 0;
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Hero balance card — 8/12 */}
      <div
        className="lg:col-span-8 p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #166969 0%, #004747 100%)",
          minHeight: "200px",
          color: "var(--on-primary)",
        }}
      >
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <EyebrowLabel light>Solde Total</EyebrowLabel>
              <h2
                className="mt-2 tracking-tighter font-numeric"
                style={{
                  fontFamily: "var(--font-manrope), sans-serif",
                  fontSize: "3.5rem",
                  fontWeight: 900,
                  lineHeight: 1,
                  color: "var(--on-primary)",
                }}
              >
                {formatMAD(totalBalance)}{" "}
                <span style={{ fontSize: "1.5rem", fontWeight: 500 }}>MAD</span>
              </h2>
            </div>
            <div
              className="p-3 rounded-2xl"
              style={{ backgroundColor: "rgba(255,255,255,0.10)", backdropFilter: "blur(8px)" }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
              </svg>
            </div>
          </div>

          <div className="mt-12 flex gap-8">
            <div>
              <EyebrowLabel light>Revenus (Ce mois)</EyebrowLabel>
              <p className="text-xl font-bold font-numeric mt-1" style={{ fontFamily: "var(--font-manrope), sans-serif" }}>
                + {formatMAD(monthlyIncome)}
              </p>
            </div>
            <div className="h-10 w-px self-center" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
            <div>
              <EyebrowLabel light>Dépenses (Ce mois)</EyebrowLabel>
              <p className="text-xl font-bold font-numeric mt-1" style={{ fontFamily: "var(--font-manrope), sans-serif" }}>
                - {formatMAD(monthlyExpenses)}
              </p>
            </div>
          </div>
        </div>

        <div
          className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full pointer-events-none"
          style={{ backgroundColor: "rgba(166,239,239,0.10)", filter: "blur(40px)" }}
        />
      </div>

      {/* Right: two secondary stat cards */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <MetricCard
          label="Économies (Objectifs)"
          value={formatMAD(totalSaved)}
          accentColor="var(--tertiary)"
          progress={savingsPct}
          badge={
            totalTarget > 0
              ? <Badge variant="primary">{savingsPct}%</Badge>
              : <Badge variant="neutral">Aucun objectif</Badge>
          }
        />
        <MetricCard
          label="Dépenses (Ce mois)"
          value={formatMAD(monthlyExpenses)}
          accentColor="var(--error)"
          progress={expensesPct}
          badge={<Badge variant="error">Ce mois</Badge>}
        />
      </div>
    </section>
  );
}
