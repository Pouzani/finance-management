'use client';

import { Loader2, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import Button from './Button';

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  triggerAriaLabel: string;
  className?: string;
};

export default function ActionMenu({
  isOpen, onToggle, onEdit, onDelete, isDeleting, triggerAriaLabel, className = '',
}: Props) {
  const t = useTranslations('common');
  const [pos, setPos] = useState<{ top?: number; bottom?: number; right: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const DROPDOWN_HEIGHT = 96; // approx height of 2-item menu

  function handleToggle(e: React.MouseEvent<HTMLButtonElement>) {
    if (!isOpen) {
      const rect = e.currentTarget.getBoundingClientRect();
      const right = window.innerWidth - rect.right;
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < DROPDOWN_HEIGHT + 8) {
        setPos({ bottom: window.innerHeight - rect.top + 4, right });
      } else {
        setPos({ top: rect.bottom + 4, right });
      }
    }
    onToggle();
  }

  const dropdown = isOpen && pos && mounted
    ? createPortal(
        <div
          data-action-menu
          className="rounded-xl overflow-hidden"
          style={{
            position: 'fixed',
            ...(pos.top !== undefined ? { top: pos.top } : { bottom: pos.bottom }),
            right: pos.right,
            zIndex: 9999,
            backgroundColor: 'var(--surface-container-lowest)',
            boxShadow: '0px 8px 24px rgba(43,52,55,0.12)',
            minWidth: '140px',
          }}
        >
          <button
            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-colors"
            style={{ color: 'var(--on-surface)', border: 'none', background: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(241,244,246,0.7)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            onClick={onEdit}
          >
            <Pencil size={13} />
            {t('edit')}
          </button>
          <button
            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-colors"
            style={{ color: 'var(--error)', border: 'none', background: 'none', cursor: 'pointer', borderTop: '1px solid rgba(227,233,236,0.4)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(186,26,26,0.05)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            disabled={isDeleting}
            onClick={onDelete}
          >
            {isDeleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
            {isDeleting ? t('deleting') : t('delete')}
          </button>
        </div>,
        document.body
      )
    : null;

  return (
    <div
      className={`relative shrink-0 ${className}`}
      data-action-menu
    >
      <Button
        variant="ghost"
        aria-label={triggerAriaLabel}
        aria-expanded={isOpen}
        onClick={handleToggle as React.MouseEventHandler<HTMLButtonElement>}
        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: 'var(--on-surface-variant)' }}
      >
        <MoreHorizontal size={14} />
      </Button>

      {dropdown}
    </div>
  );
}
