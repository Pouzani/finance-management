import { getAccounts } from "@/lib/api";
import AccountsView from "@/components/accounts/AccountsView";

export default async function AccountsPage() {
  const accounts = await getAccounts().catch(() => []);
  return <AccountsView accounts={accounts} />;
}
