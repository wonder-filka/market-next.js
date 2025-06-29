import { AccountCard } from "./_components/account-card"
import WalletInterface from "./_components/wallet-interface"

const accounts = [
  {
    id: "590670305",
    isDemo: true,
    type: "hedging",
    balance: 1234.56,
    freeMargin: 1234.56,
    currency: "£"
  },
  {
    id: "5910670305",
    isDemo: true,
    type: "hedging",
    balance: 1234.56,
    freeMargin: 1234.56,
    currency: "£"
  }
]

const wallet = {
  balance: 1234.56,
  currency: "£"
}

export default async function WalletPage() {
  return (
    <>
      <WalletInterface wallet={wallet}/>
      <AccountCard accounts={accounts} />
    </>
  )
}