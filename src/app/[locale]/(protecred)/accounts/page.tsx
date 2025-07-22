'use server';

import { getSessionUserId } from '@/lib/session';
import WalletInterface from './_components/wallet-interface';
import { AccountCard } from './_components/account-card';
import { getRates } from '@/lib/rates';
import { getUser } from './_actions';

export default async function Page() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const user = await getUser(userId);
  if (!user) return null;

  const rates = await getRates([...new Set(user.accounts.map(a => a.currency))]);

  const safeRates: Record<string, number> = Object.fromEntries(
    Object.entries(rates)
      .filter(([_, v]) => typeof v === "number" && !isNaN(v))
      .map(([k, v]) => [k, v as number])
  );

  return (
    <>
      <WalletInterface wallet={user.wallet} userId={userId} accounts={ user.accounts}  rates={safeRates}/>
      <AccountCard accounts={ user.accounts} userId={userId} rates={safeRates} />
    </>
  );
}
