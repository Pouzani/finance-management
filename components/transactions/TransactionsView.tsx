'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import {
  Search, Plus, X, Loader2, SlidersHorizontal, ChevronDown,
} from 'lucide-react';
import Input from '@/components/ui/Input';
import {
  ApiTransaction, ApiAccount, ApiCategory,
  getTransactions, deleteTransaction,
} from '@/lib/api';
import { formatMAD, formatDateLabel } from '@/lib/data';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import IconBox from '@/components/ui/IconBox';
import EyebrowLabel from '@/components/ui/EyebrowLabel';
import ActionMenu from '@/components/ui/ActionMenu';
import AddTransactionDrawer from './AddTransactionDrawer';
import { CATEGORY_ICONS, DEFAULT_ICON } from '@/lib/categoryIcons';
import { useActionMenuOutsideClick } from '@/hooks/useActionMenuOutsideClick';

// ── Constants ────────────────────────────────────────────────────────────────

const FILTER_TYPES = ['all', 'income', 'expense'] as const;
type FilterType = typeof FILTER_TYPES[number];

// ── Helpers ───────────────────────────────────────────────────────────────────

function groupByDate(txs: ApiTransaction[]): [string, ApiTransaction[]][] {
  const map = new Map<string, ApiTransaction[]>();
  for (const tx of txs) {
    const group = map.get(tx.date);
    if (group) {
      group.push(tx);
    } else {
      map.set(tx.date, [tx]);
    }
  }
  return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
}

function dayNet(txs: ApiTransaction[]): number {
  return txs.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
}

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
  initialTransactions: ApiTransaction[];
  initialTotal: number;
  accounts: ApiAccount[];
  categories: ApiCategory[];
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function TransactionsView({
  initialTransactions, initialTotal, accounts, categories,
}: Props) {
  const t = useTranslations('transactions');
  const locale = useLocale();

  // ── Filter state
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterCategory, setFilterCategory] = useState('');

  // ── Data state
  const [transactions, setTransactions] = useState(initialTransactions);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialTotal > initialTransactions.length);

  // ── Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<ApiTransaction | null>(null);

  // ── Action menu
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // Skip the initial effect run — initialTransactions already loaded server-side
  const isMounted = useRef(false);

  useActionMenuOutsideClick(!!menuOpenId, setMenuOpenId);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchData = useCallback(async (opts: {
    search: string;
    type: FilterType;
    category: string;
    page: number;
    append?: boolean;
  }) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        ordering: '-date',
        page: String(opts.page),
      };
      if (opts.search) params.search = opts.search;
      if (opts.type !== 'all') params.type = opts.type;
      if (opts.category) params.category = opts.category;

      const result = await getTransactions(params);

      if (opts.append) {
        setTransactions((prev) => [...prev, ...result.results]);
      } else {
        setTransactions(result.results);
        setPage(1);
      }
      setTotal(result.count);
      setHasMore(result.next !== null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      fetchData({ search, type: filterType, category: filterCategory, page: 1 });
    }, 350);
    return () => clearTimeout(searchTimer.current);
  }, [search, filterType, filterCategory, fetchData]);

  // ── Stats (computed from loaded transactions) ──────────────────────────────

  const { totalIncome, totalExpenses, incomeCount, expenseCount } = useMemo(() =>
    transactions.reduce(
      (acc, tx) => {
        if (tx.type === 'income') {
          acc.totalIncome += parseFloat(tx.amount);
          acc.incomeCount++;
        } else {
          acc.totalExpenses += Math.abs(parseFloat(tx.amount));
          acc.expenseCount++;
        }
        return acc;
      },
      { totalIncome: 0, totalExpenses: 0, incomeCount: 0, expenseCount: 0 },
    ),
  [transactions]);
  const netBalance = totalIncome - totalExpenses;
  const statsPartial = total > transactions.length;

  const statsData = [
    { label: t('income'), value: totalIncome, sign: '+', color: 'var(--primary)', count: incomeCount },
    { label: t('expenses'), value: totalExpenses, sign: '−', color: 'var(--error)', count: expenseCount },
    { label: t('netBalance'), value: Math.abs(netBalance), sign: netBalance >= 0 ? '+' : '−', color: netBalance >= 0 ? 'var(--primary)' : 'var(--error)' },
  ];

  // ── Grouped list ───────────────────────────────────────────────────────────

  const groups = groupByDate(transactions);

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleDrawerClose() {
    setDrawerOpen(false);
    setEditingTx(null);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
      setTotal((prev) => prev - 1);
    } finally {
      setDeletingId(null);
      setMenuOpenId(null);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 overflow-y-auto">

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div className="px-8 pt-8 pb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <EyebrowLabel className="mb-2 block">{t('eyebrow')}</EyebrowLabel>
            <h1
              style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '2rem',
                fontWeight: 900,
                color: 'var(--on-surface)',
                lineHeight: 1.1,
              }}
            >
              {t('title')}
            </h1>
            <p
              className="mt-1"
              style={{ fontSize: '13px', color: 'var(--on-surface-variant)' }}
            >
              {filterType !== 'all' || filterCategory || search
                ? t('totalCountFiltered', { count: total })
                : t('totalCount', { count: total })}
            </p>
          </div>

          <Button
            variant="primary"
            onClick={() => { setEditingTx(null); setDrawerOpen(true); }}
            style={{ gap: '6px', marginTop: '4px' }}
          >
            <Plus size={14} strokeWidth={2.5} />
            {t('newTransaction')}
          </Button>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-4">
          {statsData.map(({ label, value, sign, color, count }) => (
            <div
              key={label}
              className="rounded-2xl p-4 anim-enter"
              style={{
                backgroundColor: 'var(--surface-container-lowest)',
                boxShadow: '0px 4px 16px rgba(43,52,55,0.05)',
              }}
            >
              <EyebrowLabel className="mb-2 block">{label}</EyebrowLabel>
              <div className="flex items-end justify-between gap-2">
                <p
                  className="font-bold font-numeric leading-none"
                  style={{
                    fontFamily: 'var(--font-manrope), sans-serif',
                    fontSize: '1.15rem',
                    color,
                  }}
                >
                  {sign} {formatMAD(value)}{' '}
                  <span style={{ fontSize: '9px', fontWeight: 500 }}>MAD</span>
                </p>
                {count !== undefined && (
                  <span style={{ fontSize: '10px', color: 'var(--on-surface-variant)', whiteSpace: 'nowrap' }}>
                    {t('loaded', { count })}
                  </span>
                )}
              </div>
              {statsPartial && (
                <p
                  className="mt-1.5"
                  style={{ fontSize: '9px', color: 'var(--on-surface-variant)', opacity: 0.7 }}
                >
                  {t('loaded', { count: transactions.length })}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Sticky filter bar ────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-10 px-8 py-3"
        style={{
          backgroundColor: 'rgba(241,244,246,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--on-surface-variant)' }}
            />
            <Input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm"
              style={{
                backgroundColor: 'var(--surface-container-lowest)',
                border: 'none',
                padding: '10px 36px',
              }}
            />
            {search && (
              <Button
                variant="ghost"
                onClick={() => setSearch('')}
                aria-label={t('clearSearch')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--on-surface-variant)', padding: '0' }}
              >
                <X size={12} />
              </Button>
            )}
          </div>

          {/* Type filter pill group */}
          <div
            className="flex gap-0.5 rounded-xl p-1"
            style={{ backgroundColor: 'var(--surface-container-lowest)' }}
            role="group"
            aria-label={t('filterByType')}
          >
            {FILTER_TYPES.map((filterVal) => (
              <button
                key={filterVal}
                onClick={() => setFilterType(filterVal)}
                aria-pressed={filterType === filterVal}
                className="px-3 py-1.5 rounded-lg transition-all font-bold"
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-manrope), sans-serif',
                  backgroundColor: filterType === filterVal ? 'var(--primary)' : 'transparent',
                  color: filterType === filterVal ? 'var(--on-primary)' : 'var(--on-surface-variant)',
                  letterSpacing: '0.02em',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {filterVal === 'all' ? t('filterAll') : filterVal === 'income' ? t('filterIncome') : t('filterExpense')}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <div className="relative">
            <label htmlFor="filter-category" className="sr-only">{t('filterCategory')}</label>
            <select
              id="filter-category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-xl pl-3 pr-8 py-2.5 text-xs font-bold outline-none appearance-none"
              style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                backgroundColor: filterCategory
                  ? 'var(--primary-container)'
                  : 'var(--surface-container-lowest)',
                color: filterCategory
                  ? 'var(--on-primary-container)'
                  : 'var(--on-surface-variant)',
                border: 'none',
              }}
            >
              <option value="">{t('filterCategory')}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <ChevronDown
              size={10}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                color: filterCategory
                  ? 'var(--on-primary-container)'
                  : 'var(--on-surface-variant)',
              }}
            />
          </div>

          {loading && (
            <Loader2
              size={15}
              className="animate-spin shrink-0"
              aria-label={t('loading')}
              style={{ color: 'var(--primary)' }}
            />
          )}
        </div>
      </div>

      {/* ── Transaction list ─────────────────────────────────────────────────── */}
      <div className="px-8 pb-12 mt-6 space-y-6">
        {groups.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="w-16 h-16 rounded-3xl mb-5 flex items-center justify-center"
              style={{ backgroundColor: 'var(--surface-container)' }}
            >
              <SlidersHorizontal size={22} style={{ color: 'var(--on-surface-variant)' }} />
            </div>
            <p
              className="font-bold mb-2"
              style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '1rem',
                color: 'var(--on-surface)',
              }}
            >
              {t('noResults')}
            </p>
            <p style={{ fontSize: '13px', color: 'var(--on-surface-variant)' }}>
              {t('noResultsSub')}
            </p>
          </div>
        ) : (
          groups.map(([date, txs], groupIdx) => {
            const net = dayNet(txs);
            const delayClass = `anim-delay-${Math.min(groupIdx + 1, 6)}`;
            return (
              <div key={date} className={`anim-enter ${delayClass}`}>
                {/* Date group header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: 'var(--outline-variant)' }}
                    />
                    <p
                      className="font-bold uppercase tracking-wider"
                      style={{
                        fontSize: '10px',
                        color: 'var(--on-surface-variant)',
                        fontFamily: 'var(--font-manrope), sans-serif',
                      }}
                    >
                      {formatDateLabel(date, locale)}
                    </p>
                  </div>
                  <span
                    className="font-bold font-numeric"
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-manrope), sans-serif',
                      color: net >= 0 ? 'var(--primary)' : 'var(--error)',
                    }}
                  >
                    {net >= 0 ? '+' : '−'} {formatMAD(Math.abs(net))} MAD
                  </span>
                </div>

                {/* Rows */}
                <Card padding="none" overflow>
                  {txs.map((tx, rowIdx) => {
                    const catName = tx.category_detail?.name ?? '';
                    const cat = CATEGORY_ICONS[catName] ?? DEFAULT_ICON;
                    const Icon = cat.icon;
                    const amount = Math.abs(parseFloat(tx.amount));

                    return (
                      <div
                        key={tx.id}
                        className="group flex items-center gap-4 px-5 py-4 transition-colors"
                        style={{
                          borderTop: rowIdx > 0
                            ? '1px solid rgba(227,233,236,0.35)'
                            : 'none',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor =
                            'rgba(241,244,246,0.55)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor =
                            'transparent';
                        }}
                      >
                        {/* Category color accent */}
                        <div
                          className="w-0.5 self-stretch rounded-full shrink-0"
                          style={{
                            backgroundColor:
                              tx.category_detail?.color ?? 'var(--outline-variant)',
                            minHeight: '28px',
                            opacity: 0.7,
                          }}
                        />

                        {/* Icon */}
                        <IconBox bg={cat.bg} color={cat.color} size="md" shape="rounded-xl">
                          <Icon size={14} />
                        </IconBox>

                        {/* Label + meta */}
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-bold truncate"
                            style={{ color: 'var(--on-surface)' }}
                          >
                            {tx.label}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            {catName && (
                              <Badge variant="neutral" className="py-0">{catName}</Badge>
                            )}
                            <span
                              style={{ fontSize: '10px', color: 'var(--on-surface-variant)' }}
                            >
                              {tx.account_name}
                            </span>
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="text-right shrink-0">
                          <p
                            className="font-bold text-sm font-numeric"
                            style={{
                              fontFamily: 'var(--font-manrope), sans-serif',
                              color: tx.type === 'income' ? 'var(--primary)' : 'var(--error)',
                            }}
                          >
                            {tx.type === 'income' ? '+' : '−'} {formatMAD(amount)}
                            <span
                              className="font-normal ml-0.5"
                              style={{ fontSize: '9px' }}
                            >
                              MAD
                            </span>
                          </p>
                          <p style={{ fontSize: '10px', color: 'var(--on-surface-variant)' }}>
                            {tx.date}
                          </p>
                        </div>

                        {/* Actions */}
                        <ActionMenu
                          isOpen={menuOpenId === tx.id}
                          onToggle={() => setMenuOpenId(menuOpenId === tx.id ? null : tx.id)}
                          onEdit={() => { setEditingTx(tx); setDrawerOpen(true); setMenuOpenId(null); }}
                          onDelete={() => handleDelete(tx.id)}
                          isDeleting={deletingId === tx.id}
                          triggerAriaLabel={t('actionsFor', { label: tx.label })}
                        />
                      </div>
                    );
                  })}
                </Card>
              </div>
            );
          })
        )}

        {/* Load more */}
        {hasMore && !loading && (
          <div className="flex justify-center pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchData({
                  search, type: filterType, category: filterCategory,
                  page: nextPage, append: true,
                });
              }}
              className="px-6 py-3 rounded-2xl"
              style={{
                backgroundColor: 'var(--surface-container)',
                color: 'var(--on-surface-variant)',
                fontSize: '12px',
              }}
            >
              {t('loadMore', { count: total - transactions.length })}
            </Button>
          </div>
        )}
      </div>

      {/* ── Add / Edit Transaction Drawer ──────────────────────────────────────── */}
      <AddTransactionDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        accounts={accounts}
        categories={categories}
        editTransaction={editingTx}
        onSuccess={() =>
          fetchData({ search, type: filterType, category: filterCategory, page: 1 })
        }
      />
    </div>
  );
}
