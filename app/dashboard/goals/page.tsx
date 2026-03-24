import { getGoals } from "@/lib/api";
import GoalsView from "@/components/goals/GoalsView";

export default async function GoalsPage() {
  const goals = await getGoals().catch(() => []);
  return <GoalsView goals={goals} />;
}
