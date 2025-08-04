'use client'

import { useI18n } from "@/locales/client"
import { AccountItem } from "./account-item"
import { OpenAccount } from "./open-account"
import { OpenDemoAccount } from "./open-demo-account"
import { Account } from "../../../../../../prisma/generated/prisma"

type AccountProps = {
  accounts: Account[]
  userId: string
  rates: Record<string, number>
}

export function AccountCard({ accounts, userId, rates }: AccountProps) {
  const t = useI18n()
  const sortedAccounts = [...accounts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const realAccounts = sortedAccounts.filter((acc) => !acc.isDemo)
  const demoAccounts = sortedAccounts.filter((acc) => acc.isDemo)
  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <span className="text-2xl font-bold">{t("accountsTitle")}</span>
        <div className="flex  flex-col md:flex-row  gap-4 itemd-start md:items-center ">
          <OpenAccount userId={userId} />
          {demoAccounts.length === 0 && <OpenDemoAccount userId={userId} />} 
        </div>
      </div>

      {realAccounts.length > 0 ? (
        <div className="flex flex-col gap-4 my-8">
          {realAccounts.map((account) => (
            <AccountItem key={account.id} account={account} rates={rates} />
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground py-12 text-center">
          {t("noAccounts")}
        </div>
      )}
      {demoAccounts.length > 0 && (
        <>
          <div className="text-lg font-semibold mb-2">{t("demoAccountsTitle")}</div>
          <div className="flex flex-col gap-4 my-4">
            {demoAccounts.map((account) => (
              <AccountItem key={account.id} account={account} rates={rates} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
