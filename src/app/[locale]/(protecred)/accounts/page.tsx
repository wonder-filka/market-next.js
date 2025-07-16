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
  const accUSD = user.accounts.map(a => {
    const rate = a.currency === 'USD' ? 1 : rates[a.currency] ?? 1;
    return {
      ...a,
      balance: +(a.balance * rate).toFixed(2),
      freeMargin: +(a.freeMargin * rate).toFixed(2),
    };
  });

  return (
    <>
      <WalletInterface wallet={user.wallet} userId={userId} accounts={accUSD} />
      <AccountCard accounts={accUSD} userId={userId} />
    </>
  );
}
