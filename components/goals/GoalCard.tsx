'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Trash2, Check, X, Sparkles } from 'lucide-react';
import type { ApiGoal } from '@/lib/api';
import { formatMAD } from '@/lib/data';
import { resolveGoalIcon } from '@/lib/goalIcons';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import RingProgress from '@/components/ui/RingProgress';
import ProgressBar from '@/components/ui/ProgressBar';

function calcPct(current: number, target: number): number {
  return target > 0 ? Math.round((current / target) * 100) : 0;
}

type Props = {
  goal: ApiGoal;
  isDeleting: boolean;
  onDelete: (id: string) => void;
  onContribute: (id: string, delta: number) => Promise<void>;
  delayClass?: string;
};

export default function GoalCard({ goal, isDeleting, onDelete, onContribute, delayClass = '' }: Props) {
  const t = useTranslations('goals');
  const [contributeInput, setContributeInput] = useState('');
  const [isContributing, setIsContributing] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isContributing) inputRef.current?.focus();
  }, [isContributing]);

  const current = parseFloat(goal.current);
  const target = parseFloat(goal.target);
  const pct = calcPct(current, target);
  const remaining = Math.max(0, target - current);
  const isComplete = current >= target;
  const ringColor = isComplete ? '#10b981' : goal.color || 'var(--primary)';
  const iconDef = resolveGoalIcon(goal.icon);
  const Icon = iconDef.icon;

  async function commit() {
    const delta = parseFloat(contributeInput);
    if (isNaN(delta)) {
      cancel();
      return;
    }
    setSaving(true);
    try {
      await onContribute(goal.id, delta);
    } finally {
      setSaving(false);
      cancel();
    }
  }

  function cancel() {
    setIsContributing(false);
    setContributeInput('');
  }

  return (
    <div
      className={`rounded-3xl shadow-ambient anim-enter ${delayClass} card-interactive`}
      style={{
        backgroundColor: 'var(--surface-container-lowest)',
        borderTop: `3px solid ${ringColor}`,
        opacity: isDeleting ? 0.5 : 1,
      }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: iconDef.bg, color: iconDef.color }}
            >
              <Icon size={18} />
            </div>
            <div>
              <p
                className="font-bold leading-tight"
                style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '15px', color: 'var(--on-surface)' }}
              >
                {goal.label}
              </p>
              {isComplete && (
                <span
                  className="inline-flex items-center gap-1 mt-1"
                  style={{ fontSize: '10px', color: '#10b981', fontWeight: 700 }}
                >
                  <Sparkles size={10} />
                  {t('completed_badge')}
                </span>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={() => onDelete(goal.id)}
            loading={isDeleting}
            disabled={isDeleting}
            aria-label={t('deleteAriaLabel', { goalLabel: goal.label })}
            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:opacity-100"
            style={{ color: 'var(--outline-variant)' }}
          >
            {!isDeleting && <Trash2 size={14} />}
          </Button>
        </div>

        <div className="flex items-center gap-5 mb-5">
          <div className="relative shrink-0">
            <RingProgress pct={pct} color={ringColor} size={80} />
            <div className="absolute inset-0 flex items-center justify-center" style={{ pointerEvents: 'none' }}>
              <span
                className="font-black font-numeric"
                style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '14px', color: ringColor }}
              >
                {pct}%
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>{t('saved')}</span>
                <span
                  className="font-bold font-numeric"
                  style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '13px', color: 'var(--on-surface)' }}
                >
                  {formatMAD(current)} <span style={{ fontSize: '9px', fontWeight: 500 }}>MAD</span>
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>{t('target')}</span>
                <span
                  className="font-bold font-numeric"
                  style={{ fontFamily: 'var(--font-manrope), sans-serif', fontSize: '13px', color: 'var(--on-surface-variant)' }}
                >
                  {formatMAD(target)} <span style={{ fontSize: '9px', fontWeight: 500 }}>MAD</span>
                </span>
              </div>
              {!isComplete && (
                <div className="flex justify-between items-baseline">
                  <span style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>{t('remainingLabel')}</span>
                  <span className="font-numeric" style={{ fontSize: '11px', color: 'var(--outline)', fontWeight: 600 }}>
                    {formatMAD(remaining)} MAD
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <ProgressBar value={pct} color={ringColor} className="mb-4" />

        {isContributing ? (
          <div className="flex items-center gap-2">
            <div
              className="flex-1 flex items-center rounded-xl overflow-hidden"
              style={{ backgroundColor: 'var(--surface-container)', border: '2px solid rgba(22,105,105,0.20)' }}
            >
              <span style={{ fontSize: '11px', color: 'var(--on-surface-variant)', paddingLeft: '10px', whiteSpace: 'nowrap' }}>
                ± MAD
              </span>
              <Input
                ref={inputRef}
                type="text"
                value={contributeInput}
                onChange={(e) => setContributeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commit();
                  if (e.key === 'Escape') cancel();
                }}
                disabled={saving}
                placeholder="ex: 500"
                className="flex-1 font-bold font-numeric text-right"
                style={{ background: 'none', border: 'none', padding: '8px', fontSize: '13px', fontFamily: 'var(--font-manrope), sans-serif', fontWeight: 700, color: 'var(--on-surface)' }}
                aria-label={t('amountAriaLabel', { goalLabel: goal.label })}
              />
            </div>
            <Button
              variant="primary"
              onClick={commit}
              loading={saving}
              disabled={saving}
              aria-label={t('confirmAriaLabel')}
              className="p-2 rounded-xl shrink-0"
              style={{ boxShadow: 'none' }}
            >
              {!saving && <Check size={14} strokeWidth={2.5} />}
            </Button>
            <Button
              variant="ghost"
              onClick={cancel}
              disabled={saving}
              aria-label={t('cancelAriaLabel')}
              className="p-2 rounded-xl shrink-0"
              style={{ backgroundColor: 'var(--surface-container)', color: 'var(--on-surface-variant)' }}
            >
              <X size={14} />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={() => setIsContributing(true)}
            disabled={isComplete}
            className="w-full py-2 rounded-xl"
            style={{
              fontSize: '12px',
              backgroundColor: isComplete ? 'var(--surface-container)' : `${ringColor}14`,
              color: isComplete ? 'var(--on-surface-variant)' : ringColor,
              cursor: isComplete ? 'default' : 'pointer',
              letterSpacing: '0.04em',
              justifyContent: 'center',
            }}
          >
            {isComplete ? t('goalReached') : t('addFunds')}
          </Button>
        )}
      </div>
    </div>
  );
}
