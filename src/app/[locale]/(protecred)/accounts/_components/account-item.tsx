'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Account } from "@/generated/prisma"
import { formatter, getCurrencySymbol } from "@/lib/helpers"
import { useI18n } from "@/locales/client"
import { useRouter } from "next/navigation"

interface AccountProps {
  account: Account
  userId: string
}


export function AccountItem({ account, userId }:AccountProps) {
  const t = useI18n()
  const router = useRouter()
  return (
    <Card>
      <CardContent className="flex justify-between items-start md:items-center flex-col md:flex-row gap-8">
        <div>
          <div className="flex items-center gap-8">
            <span className="text-2xl font-bold">#{account.mt5Id}</span>
            {/* <span className="text-sm text-muted-foreground">{t('hedging')}</span> */}
          </div>
        </div>
        <div className="flex-1 flex justify-between md:justify-center gap-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{t('accountBalance')}</p>
            <p className="text-2xl font-bold">   {getCurrencySymbol(account.currency)} {formatter.format(account.balance)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{t('freeMargin')}</p>
            <p className="text-2xl font-bold">   {getCurrencySymbol(account.currency)} {formatter.format(account.freeMargin)}</p>
          </div>
        </div>
        <div className="flex gap-8">
          <Button variant="outline">{t('deposit')}</Button>
          <Button variant="default" onClick={() => router.push('/dashboard')}>{t('trade')}</Button>
        </div>
      </CardContent>
    </Card>
  )
}
