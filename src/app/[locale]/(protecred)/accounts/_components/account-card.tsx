'use client'

import { useI18n } from "@/locales/client"
import { AccountItem } from "./account-item"
import { OpenAccount } from "./open-account"
import { Account } from "@/generated/prisma"

type AccountProps = {
  accounts: Account[]
  userId: string
}
 
export function AccountCard({ accounts, userId }: AccountProps) {
  const t = useI18n()
  return (
    <div className="flex flex-col gap-4 p-8">
        <div className="flex justify-between">
          <span className="text-2xl font-bold">{t("accountsTitle")}</span>
         <OpenAccount userId={userId}/>
        </div>

        {accounts.length > 0 ? (
          <div className="flex flex-col gap-8">
            {accounts.map((account) => (
              <AccountItem key={account.id} account={account} userId={userId} />
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
