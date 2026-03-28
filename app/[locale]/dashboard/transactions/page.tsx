import { getTransactions, getAccounts, getCategories } from "@/lib/api";
import TransactionsView from "@/components/transactions/TransactionsView";

export default async function TransactionsPage() {
  const [txPage, accounts, categories] = await Promise.all([
    getTransactions({ ordering: "-date", page: "1" }).catch(() => ({
      count: 0, next: null, previous: null, results: [],
    })),
    getAccounts().catch(() => []),
    getCategories().catch(() => []),
  ]);

  return (
    <TransactionsView
      initialTransactions={txPage.results}
      initialTotal={txPage.count}
      accounts={accounts}
      categories={categories}
    />
  );
}
