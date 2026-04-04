import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import AuthGuard from '@/components/AuthGuard';
import { TransactionDrawerProvider } from '@/contexts/TransactionDrawerContext';
import GlobalTransactionDrawer from '@/components/layout/GlobalTransactionDrawer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TransactionDrawerProvider>
      <div
        className="flex h-screen overflow-hidden"
        style={{ backgroundColor: 'var(--surface)' }}
      >
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <TopBar />
          <div className="flex-1 overflow-hidden flex">
            <AuthGuard>{children}</AuthGuard>
          <GlobalTransactionDrawer />
          </div>
        </div>
      </div>
    </TransactionDrawerProvider>
  );
}
