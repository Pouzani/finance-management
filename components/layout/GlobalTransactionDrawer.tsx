'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTransactionDrawer } from '@/contexts/TransactionDrawerContext';
import AddTransactionDrawer from '@/components/transactions/AddTransactionDrawer';
import { getAccounts, getCategories, ApiAccount, ApiCategory } from '@/lib/api';

export default function GlobalTransactionDrawer() {
  const { isOpen, closeDrawer } = useTransactionDrawer();
  const router = useRouter();
  const [accounts, setAccounts] = useState<ApiAccount[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    Promise.all([
      getAccounts().catch(() => []),
      getCategories().catch(() => []),
    ]).then(([accs, cats]) => {
      setAccounts(accs);
      setCategories(cats);
    });
  }, [isOpen]);

  return (
    <AddTransactionDrawer
      open={isOpen}
      onClose={closeDrawer}
      accounts={accounts}
      categories={categories}
      onSuccess={() => {
        closeDrawer();
        router.refresh();
      }}
    />
  );
}
