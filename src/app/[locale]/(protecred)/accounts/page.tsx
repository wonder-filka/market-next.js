'use server'

import { getSessionUserId } from "@/lib/session"
import { AccountCard } from "./_components/account-card"
import WalletInterface from "./_components/wallet-interface"
import { prisma } from "@/lib/db"
import yahooFinance from "yahoo-finance2"


async function getRates(currencies: string[]) {
  const pairs = currencies
    .filter(c => c !== 'USD')
    .map(c => `USD${c}=X`);

  if (!pairs.length) return {};
  const quotes = await yahooFinance.quote(pairs);

  const arr    = Array.isArray(quotes) ? quotes : [quotes];

  return Object.fromEntries(
    arr.map(q => [ q.symbol.replace('USD','').replace('=X',''), q.regularMarketPrice ])
  );                                           // { EUR: 0.85, GBP: 0.79 … }
}


export default async function WalletPage() {
  const userId = await getSessionUserId()
  if (!userId) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      wallet: true,
      accounts: true,
    },
  })

  if (!user) {
    return null
  }
  const currencies = [...new Set(user.accounts.map(a => a.currency))];
  const rates      = await getRates(currencies);

  const convertedAccounts = user.accounts.map(acc => {
    const rate = acc.currency === 'USD' ? 1 : rates[acc.currency] ?? 1;
    return {
      ...acc,
      balance:    +(acc.balance    * rate).toFixed(2),
      freeMargin: +(acc.freeMargin * rate).toFixed(2),
    };
  });
  return (
    <>
      <WalletInterface wallet={user.wallet} userId={userId} accounts={user.accounts}/>
      <AccountCard accounts={convertedAccounts} userId={userId}/>
    </>
  )
}