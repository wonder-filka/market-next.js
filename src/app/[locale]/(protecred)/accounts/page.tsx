'use server';

import { prisma } from '@/lib/db';
import { getSessionUserId } from '@/lib/session';
import WalletInterface from './_components/wallet-interface';
import { AccountCard } from './_components/account-card';
import { getRates } from '@/lib/rates';

export default async function WalletPage() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { wallet: true, accounts: true },
  });
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
