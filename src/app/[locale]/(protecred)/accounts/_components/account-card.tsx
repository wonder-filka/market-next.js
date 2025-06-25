'use client'

import { Button } from "@/components/ui/button"
import { useI18n } from "@/locales/client"
import { AccountItem } from "./account-item"
import { PlusIcon } from "lucide-react"

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
          <Button variant="default" className="bg-blue-900">
            <PlusIcon /> {t("openAccount")}
          </Button>
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
