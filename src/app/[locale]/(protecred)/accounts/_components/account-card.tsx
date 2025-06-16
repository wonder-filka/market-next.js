'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useI18n } from "@/locales/client"

type Account = {
  id: string
  isDemo: boolean
  type: string
  balance: number
  freeMargin: number
  currency: string
}

export function AccountCard({ account }: { account: Account }) {
  const t = useI18n()
  return (
    <Card>
      <CardContent className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">#{account.id}</span>
            <span className="text-sm text-muted-foreground">{t('hedging')}</span>
          </div>
          <span className="text-sm text-muted-foreground">{t('mt5')}</span>
        </div>
        <div className="flex-1 flex justify-between md:justify-center gap-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{t('accountBalance')}</p>
            <p className="text-2xl font-bold">{account.currency} {account.balance.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{t('freeMargin')}</p>
            <p className="text-2xl font-bold">{account.currency} {account.freeMargin.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">{t('deposit')}</Button>
          <Button variant="default" >{t('trade')}</Button>
        </div>
      </CardContent>
    </Card>
  )
}
