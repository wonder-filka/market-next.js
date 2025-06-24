
import { Button } from "@/components/ui/button";
import { getI18n } from "@/locales/server";
import { PlusIcon } from "lucide-react";
import { AccountCard } from "./_components/account-card";
import WalletInterface from "./_components/wallet-interface";

const accounts = [
  {
    id: "590670305",
    isDemo: true,
    type: "hedging",
    balance: 200000,
    freeMargin: 200000,
    currency: "£"
  },
  {
    id: "5910670305",
    isDemo: true,
    type: "hedging",
    balance: 200000,
    freeMargin: 200000,
    currency: "£"
  }
]

export default async function Page() {
  const t = await getI18n()
  return (
    <>
      <div className="flex flex-col gap-4 p-8">
        <div className="flex justify-between">
          <span className="text-2xl font-bold">Ваш кошелек</span>
          <Button variant="ghost" >
            Transaction history
          </Button>
        </div>
        <WalletInterface />
      </div>


      <div className="flex flex-col gap-4 p-8">
        <div className="flex justify-between">
          <span className="text-2xl font-bold">{t('accountsTitle')}</span>
          <Button variant="ghost" >
            <PlusIcon />  {t('openAccount')}
          </Button>
        </div>

        {accounts.length > 0 ? (
          <div className="flex flex-col gap-6">
            {accounts.map(acc => (
              <AccountCard key={acc.id} account={acc} />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground py-12 text-center">{t('noAccounts')}</div>
        )}

      </div>
    </>


  )
}