'use client';

import { createContext, useCallback, useContext, useState } from 'react';

interface TransactionDrawerContextValue {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const TransactionDrawerContext = createContext<TransactionDrawerContextValue>({
  isOpen: false,
  openDrawer: () => {},
  closeDrawer: () => {},
});

export function TransactionDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openDrawer = useCallback(() => setIsOpen(true), []);
  const closeDrawer = useCallback(() => setIsOpen(false), []);
  return (
    <TransactionDrawerContext.Provider value={{ isOpen, openDrawer, closeDrawer }}>
      {children}
    </TransactionDrawerContext.Provider>
  );
}

export function useTransactionDrawer() {
  return useContext(TransactionDrawerContext);
}
