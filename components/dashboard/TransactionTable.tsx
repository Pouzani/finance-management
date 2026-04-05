'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { ApiTransaction, ApiAccount, ApiCategory, deleteTransaction } from '@/lib/api';
import { formatMAD } from '@/lib/data';
import Card from '@/components/ui/Card';
import SectionHeader from '@/components/ui/SectionHeader';
import IconBox from '@/components/ui/IconBox';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EyebrowLabel from '@/components/ui/EyebrowLabel';
import ActionMenu from '@/components/ui/ActionMenu';
import AddTransactionDrawer from '@/components/transactions/AddTransactionDrawer';
import { CATEGORY_ICONS, DEFAULT_ICON } from '@/lib/categoryIcons';
import { useActionMenuOutsideClick } from '@/hooks/useActionMenuOutsideClick';

type Props = {
  transactions: ApiTransaction[];
  accounts: ApiAccount[];
  categories: ApiCategory[];
};

export default function TransactionTable({ transactions: initialTransactions, accounts, categories }: Props) {
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() ?? '';

  const [txList, setTxList] = useState(initialTransactions);

  const filteredTxList = useMemo(() => {
    if (!query) return txList;
    return txList.filter((tx) =>
      tx.label.toLowerCase().includes(query) ||
      (tx.category_detail?.name ?? '').toLowerCase().includes(query) ||
      (tx.account_name ?? '').toLowerCase().includes(query)
    );
  }, [txList, query]);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingTx, setEditingTx] = useState<ApiTransaction | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => { setTxList(initialTransactions); }, [initialTransactions]);

useActionMenuOutsideClick(!!menuOpenId, setMenuOpenId);

  function handleDrawerClose() {
    setDrawerOpen(false);
    setEditingTx(null);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteTransaction(id);
      setTxList((prev) => prev.filter((tx) => tx.id !== id));
    } finally {
      setDeletingId(null);
      setMenuOpenId(null);
    }
  }

  function handleEditSuccess(updated: ApiTransaction) {
    setTxList((prev) => prev.map((tx) => tx.id === updated.id ? updated : tx));
  }

  return (
    <>
      <Card padding="none" overflow>
        <div className="p-8">
          <SectionHeader
            title={t('recentTransactions')}
            action={<Button variant="link">{t('viewAllHistory')}</Button>}
          />
        </div>

        {filteredTxList.length === 0 ? (
          <div className="px-8 pb-8 text-center" style={{ color: 'var(--on-surface-variant)' }}>
            <p className="text-sm">{query ? tCommon('noResults') : t('noTransactions')}</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead style={{ backgroundColor: 'var(--surface-container-low)' }}>
              <tr>
                {[t('colTransaction'), t('colCategory'), t('colAccount'), t('colAmount'), t('colAction')].map((h, i) => (
                  <th key={h} className={`px-8 py-4 ${i === 3 ? "text-right" : i === 4 ? "text-center" : ""}`}>
                    <EyebrowLabel>{h}</EyebrowLabel>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTxList.map((tx) => {
                const categoryName = tx.category_detail?.name ?? "";
                const cat = CATEGORY_ICONS[categoryName] ?? DEFAULT_ICON;
                const Icon = cat.icon;
                const amount = Math.abs(parseFloat(tx.amount));
                return (
                  <tr
                    key={tx.id}
                    className="group transition-colors"
                    style={{ borderTop: "1px solid rgba(227,233,236,0.3)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(241,244,246,0.5)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <IconBox bg={cat.bg} color={cat.color} size="lg" shape="rounded-xl">
                          <Icon size={16} />
                        </IconBox>
                        <div>
                          <p className="text-sm font-bold" style={{ color: "var(--on-surface)" }}>{tx.label}</p>
                          <p style={{ fontSize: "10px", color: "var(--on-surface-variant)" }}>{tx.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <Badge variant="neutral">{categoryName || "—"}</Badge>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-medium" style={{ color: "var(--on-surface-variant)" }}>{tx.account_name}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span
                        className="font-bold text-sm font-numeric"
                        style={{ fontFamily: "var(--font-manrope), sans-serif", color: tx.type === "income" ? "var(--primary)" : "var(--error)" }}
                      >
                        {tx.type === "income" ? "+ " : "- "}{formatMAD(amount)}{" "}
                        <span className="font-normal" style={{ fontSize: "10px" }}>MAD</span>
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <ActionMenu
                        isOpen={menuOpenId === tx.id}
                        onToggle={() => setMenuOpenId(menuOpenId === tx.id ? null : tx.id)}
                        onEdit={() => { setEditingTx(tx); setDrawerOpen(true); setMenuOpenId(null); }}
                        onDelete={() => handleDelete(tx.id)}
                        isDeleting={deletingId === tx.id}
                        triggerAriaLabel={tCommon('moreOptions')}
                        className="inline-flex justify-center"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>

      <AddTransactionDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        accounts={accounts}
        categories={categories}
        editTransaction={editingTx}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
