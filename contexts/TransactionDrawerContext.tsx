'use client';

import { createContext, useCallback, useContext, useState } from 'react';

interface TransactionDrawerContextValue {
  signal: number;
  openDrawer: () => void;
}

const TransactionDrawerContext = createContext<TransactionDrawerContextValue>({
  signal: 0,
  openDrawer: () => {},
});

export function TransactionDrawerProvider({ children }: { children: React.ReactNode }) {
  const [signal, setSignal] = useState(0);
  const openDrawer = useCallback(() => setSignal((s) => s + 1), []);
  return (
    <TransactionDrawerContext.Provider value={{ signal, openDrawer }}>
      {children}
    </TransactionDrawerContext.Provider>
  );
}

export function useTransactionDrawer() {
  return useContext(TransactionDrawerContext);
}
