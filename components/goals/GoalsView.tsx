"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Target } from "lucide-react";
import { ApiGoal, createGoal, updateGoal, deleteGoal, type CreateGoalInput } from "@/lib/api";
import { formatMAD } from "@/lib/data";
import Button from "@/components/ui/Button";
import EyebrowLabel from "@/components/ui/EyebrowLabel";
import ProgressBar from "@/components/ui/ProgressBar";
import GoalCard from "@/components/goals/GoalCard";
import AddGoalModal from "@/components/goals/AddGoalModal";

type Props = { goals: ApiGoal[] };

function calcPct(current: number, target: number): number {
  return target > 0 ? Math.round((current / target) * 100) : 0;
}

export default function GoalsView({ goals }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const { totalSaved, totalTarget, completedCount } = useMemo(
    () =>
      goals.reduce(
        (acc, g) => {
          const cur = parseFloat(g.current);
          const tgt = parseFloat(g.target);
          return {
            totalSaved: acc.totalSaved + cur,
            totalTarget: acc.totalTarget + tgt,
            completedCount: acc.completedCount + (cur >= tgt ? 1 : 0),
          };
        },
        { totalSaved: 0, totalTarget: 0, completedCount: 0 }
      ),
    [goals]
  );

  const overallPct = calcPct(totalSaved, totalTarget);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteGoal(id);
      router.refresh();
    } catch {
      // stale until next navigation
    } finally {
      setDeletingId(null);
    }
  }

  async function handleContribute(id: string, delta: number) {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return;
    const newCurrent = Math.max(0, parseFloat(goal.current) + delta).toFixed(2);
    await updateGoal(id, { current: newCurrent });
    router.refresh();
  }

  async function handleCreate(input: CreateGoalInput) {
    await createGoal(input);
    router.refresh();
  }

  return (
    <div className="flex-1 overflow-y-auto">

      <div className="px-8 pt-8 pb-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <EyebrowLabel className="mb-2 block">Patrimoine personnel</EyebrowLabel>
            <h1
              style={{
                fontFamily: "var(--font-manrope), sans-serif",
                fontSize: "2rem",
                fontWeight: 900,
                color: "var(--on-surface)",
                lineHeight: 1.1,
              }}
            >
              Objectifs
            </h1>
          </div>
          <Button variant="primary" size="md" onClick={() => setShowAdd(true)}>
            <Plus size={15} />
            Nouvel objectif
          </Button>
        </div>

        <div
          className="hero-card rounded-3xl p-8 mb-6 anim-enter"
          style={{ color: "var(--on-primary)", minHeight: "180px" }}
        >
          <div className="grain-overlay" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <EyebrowLabel light className="mb-2 block">Épargne totale</EyebrowLabel>
                {totalTarget === 0 ? (
                  <p
                    style={{
                      fontFamily: "var(--font-manrope), sans-serif",
                      fontSize: "1rem",
                      opacity: 0.7,
                      fontWeight: 500,
                    }}
                  >
                    Créez votre premier objectif ci-dessous
                  </p>
                ) : (
                  <div className="flex items-end gap-3">
                    <span
                      className="font-numeric font-black"
                      style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: "3.5rem", lineHeight: 1 }}
                    >
                      {formatMAD(totalSaved)}
                    </span>
                    <span style={{ fontSize: "13px", opacity: 0.75, marginBottom: "10px" }}>
                      MAD épargnés
                    </span>
                  </div>
                )}
              </div>

              {totalTarget > 0 && (
                <div className="text-right">
                  <p
                    className="font-bold font-numeric"
                    style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: "1.25rem", color: "rgba(255,255,255,0.95)" }}
                  >
                    {formatMAD(totalTarget)}{" "}
                    <span style={{ fontSize: "10px", fontWeight: 500 }}>MAD</span>
                  </p>
                  <p style={{ fontSize: "11px", opacity: 0.65, marginTop: "2px" }}>objectif total</p>
                </div>
              )}
            </div>

            {totalTarget > 0 && (
              <div>
                <ProgressBar
                  value={overallPct}
                  color="rgba(255,255,255,0.85)"
                  trackColor="rgba(255,255,255,0.20)"
                  className="mb-2"
                />
                <div className="flex justify-between">
                  <span style={{ fontSize: "10px", opacity: 0.6 }}>{overallPct}% atteint</span>
                  <span style={{ fontSize: "10px", opacity: 0.6 }}>
                    {formatMAD(Math.max(0, totalTarget - totalSaved))} MAD restants
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {goals.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6 anim-enter anim-delay-1">
            {[
              { label: "Objectifs actifs", value: goals.length.toString(), color: "var(--on-surface)" },
              { label: "Complétés", value: completedCount.toString(), color: "var(--primary)" },
              {
                label: "Progression moy.",
                value: `${overallPct}%`,
                color: overallPct >= 75 ? "var(--primary)" : overallPct >= 40 ? "#f59e0b" : "var(--on-surface-variant)",
              },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="rounded-2xl p-4"
                style={{ backgroundColor: "var(--surface-container-lowest)", boxShadow: "0px 4px 16px rgba(43,52,55,0.05)" }}
              >
                <EyebrowLabel className="mb-2 block">{label}</EyebrowLabel>
                <p
                  className="font-bold font-numeric leading-none"
                  style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: "1.5rem", color }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-8 pb-12">
        {goals.length > 0 && (
          <EyebrowLabel className="mb-5 block">
            {goals.length} objectif{goals.length > 1 ? "s" : ""} en cours
          </EyebrowLabel>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {goals.map((goal, idx) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              isDeleting={deletingId === goal.id}
              onDelete={handleDelete}
              onContribute={handleContribute}
              delayClass={`anim-delay-${Math.min(idx + 1, 6)}`}
            />
          ))}
        </div>

        {goals.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-24 text-center rounded-3xl anim-enter"
            style={{ backgroundColor: "var(--surface-container-lowest)" }}
          >
            <Target size={36} className="mb-4" style={{ color: "var(--outline-variant)" }} />
            <p
              className="font-bold mb-2"
              style={{ fontFamily: "var(--font-manrope), sans-serif", fontSize: "1rem", color: "var(--on-surface)" }}
            >
              Aucun objectif défini
            </p>
            <p style={{ fontSize: "13px", color: "var(--on-surface-variant)", marginBottom: "1.5rem" }}>
              Créez votre premier objectif d&apos;épargne pour commencer.
            </p>
            <Button variant="primary" size="md" onClick={() => setShowAdd(true)}>
              <Plus size={15} />
              Créer un objectif
            </Button>
          </div>
        )}
      </div>

      <AddGoalModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
