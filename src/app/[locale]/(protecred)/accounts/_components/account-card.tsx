'use client'

import { useI18n } from "@/locales/client"
import { AccountItem } from "./account-item"
import { OpenAccount } from "./open-account"

type Account = {
  id: string
  isDemo: boolean
  type: string
  balance: number
  freeMargin: number
  currency: string
}

export function AccountCard({ accounts }: { accounts: Account[] }) {
  const t = useI18n()
  return (
    <div className="flex flex-col gap-4 p-8">
        <div className="flex justify-between">
          <span className="text-2xl font-bold">{t("accountsTitle")}</span>
         <OpenAccount />
        </div>

        {accounts.length > 0 ? (
          <div className="flex flex-col gap-8">
            {accounts.map((account) => (
              <AccountItem key={account.id} account={account} />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground py-12 text-center">
            {t("noAccounts")}
          </div>
        )}
      </div>
  )
}
