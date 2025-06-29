'use server'

import { getSessionUserId } from "@/lib/session"
import { AccountCard } from "./_components/account-card"
import WalletInterface from "./_components/wallet-interface"
import { prisma } from "@/lib/db"

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


  return (
    <>
      <WalletInterface wallet={user.wallet} userId={userId}/>
      <AccountCard accounts={user.accounts} userId={userId}/>
    </>
  )
}