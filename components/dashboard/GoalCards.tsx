import { useTranslations } from 'next-intl';
import { ApiGoal } from '@/lib/api';
import { formatMAD } from '@/lib/data';
import { PlusCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import SectionHeader from '@/components/ui/SectionHeader';
import ProgressBar from '@/components/ui/ProgressBar';
import IconBox from '@/components/ui/IconBox';

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
          return (
            <Card key={goal.id} padding="sm" className="cursor-pointer transition-all hover:-translate-y-0.5">
              <div className="flex justify-between items-start mb-3">
                <IconBox bg="var(--tertiary-container)" color="var(--on-tertiary-container)" shape="rounded-xl">
                  <span className="text-base">{goal.icon}</span>
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

      {/* Promo card */}
      <div
        className="p-6 rounded-3xl relative overflow-hidden"
        style={{ backgroundColor: 'rgba(166,239,239,0.2)', border: '1px solid rgba(166,239,239,0.3)' }}
      >
        <div className="relative z-10">
          <p className="text-xs font-bold mb-1" style={{ color: 'var(--primary)' }}>
            {t('newFeature')}
          </p>
          <p className="text-sm font-bold leading-tight mb-4" style={{ color: 'var(--on-primary-container)' }}>
            {t('exportPromo')}
          </p>
          <button
            className="px-4 py-2 rounded-xl font-bold uppercase tracking-wider transition-opacity hover:opacity-90"
            style={{ fontSize: '10px', backgroundColor: 'var(--primary)', color: 'var(--on-primary)' }}
          >
            {t('tryIt')}
          </button>
        </div>
        <svg className="absolute -bottom-4 -right-4 rotate-12 opacity-10" width="96" height="96" viewBox="0 0 24 24" fill="var(--primary)">
          <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
        </svg>
      </div>
    </div>
  );
}
