import { useTranslations } from 'next-intl';
import { ApiGoal } from '@/lib/api';
import { formatMAD } from '@/lib/data';
import { PlusCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import SectionHeader from '@/components/ui/SectionHeader';
import ProgressBar from '@/components/ui/ProgressBar';
import IconBox from '@/components/ui/IconBox';
import { resolveGoalIcon } from '@/lib/goalIcons';

type Props = { goals: ApiGoal[] };

export default function GoalCards({ goals }: Props) {
  const t = useTranslations('dashboard');
  return (
    <div className="space-y-6">
      <SectionHeader
        title={t('activeGoals')}
        action={
          <PlusCircle size={20} style={{ color: "var(--on-surface-variant)", cursor: "pointer" }} />
        }
        className="px-2"
      />

      <div className="space-y-4">
        {goals.map((goal) => {
          const current = parseFloat(goal.current);
          const target = parseFloat(goal.target);
          const pct = target > 0 ? Math.round((current / target) * 100) : 0;
          const iconDef = resolveGoalIcon(goal.icon);
          const GoalIcon = iconDef.icon;
          return (
            <Card key={goal.id} padding="sm" className="cursor-pointer transition-all hover:-translate-y-0.5">
              <div className="flex justify-between items-start mb-3">
                <IconBox bg={iconDef.bg} color={iconDef.color} shape="rounded-xl">
                  <GoalIcon size={18} strokeWidth={1.8} />
                </IconBox>
                <span className="text-xs font-bold" style={{ color: goal.color }}>
                  {pct}%
                </span>
              </div>

              <p className="text-sm font-bold mb-1" style={{ color: "var(--on-surface)" }}>
                {goal.label}
              </p>
              <p className="mb-3" style={{ fontSize: "10px", color: "var(--on-surface-variant)" }}>
                {formatMAD(current)} / {formatMAD(target)} MAD
              </p>

              <ProgressBar value={pct} color={goal.color} />
            </Card>
          );
        })}

        {goals.length === 0 && (
          <p className="text-sm text-center py-4" style={{ color: 'var(--on-surface-variant)' }}>
            {t('noGoals')}
          </p>
        )}
      </div>

    </div>
  );
}
