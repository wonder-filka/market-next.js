'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Account } from "@/generated/prisma"
import { formatter, getCurrencySymbol } from "@/lib/helpers"
import { useI18n } from "@/locales/client"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { withdrawFromAccountToWallet } from "../_actions"

interface AccountProps {
  account: Account
  userId: string
  rates: Record<string, number>
}


export function AccountItem({ account, userId, rates }: AccountProps) {
  const t = useI18n()
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const rateToUSD = rates[account.currency] ?? 1
  const withdrawAmountInUSD = useMemo(() => {
    const num = Number(withdrawAmount)
    if (isNaN(num) || num <= 0) return 0
    return +(num * rateToUSD).toFixed(2)
  }, [withdrawAmount, rateToUSD])


  const handleDialogOpen = () => {
    setDialogOpen(true)
    setWithdrawAmount(account.freeMargin > 0 ? account.freeMargin.toString() : "")
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()
    const num = Number(withdrawAmount)
    if (isNaN(num) || num <= 0) {
      toast.error(t('invalidAmount'))
      return
    }
    if (num > account.freeMargin) {
      toast.error(t('insufficientFunds'))
      return
    }
    setIsLoading(true)
    try {
      // Передаём не только сумму, но и курс на сервер!
      await withdrawFromAccountToWallet({ accountId: account.id, amount: num, rateToUSD })
      toast.success(t('withdrawSuccess'))
      setDialogOpen(false)
      setWithdrawAmount("")
      router.refresh()
    } catch (e: any) {
      toast.error(t('withdrawError'))
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <>
      <Card>
        <CardContent className="flex justify-between items-center flex-col md:flex-row gap-8">
          <div>
            <div className="flex items-center gap-8">
              <span className="text-2xl font-bold">#{account.mt5Id}</span>
              {/* <span className="text-sm text-muted-foreground">{t('hedging')}</span> */}
            </div>
          </div>
          <div className="flex-1 flex  flex-col md:flex-row   justify-center gap-8">
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
            <Button variant="outline" onClick={handleDialogOpen}>{t('withdrawToWallet')}</Button>
            <Button variant="default" onClick={() => router.push('/dashboard')}>{t('trade')}</Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('withdrawToWallet')}</DialogTitle>
            <DialogDescription>
              {t('enterWithdrawAmount')} ({t('freeMargin')}: <b>{formatter.format(account.freeMargin)}</b>)
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleWithdraw}>
            <Input
              type="number"
              step="any"
              min="0"
              max={account.freeMargin}
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)}
              placeholder={t('enterWithdrawAmount')}
              disabled={isLoading}
              autoFocus
            />
            {/* Подсказка с суммой в долларах */}
            {account.currency !== "USD" && (
              <div className="text-sm text-muted-foreground mt-2">
                ≈ {formatter.format(withdrawAmountInUSD)} USD&nbsp;
                <span className="opacity-70">({t('currentRate')}: 1 {account.currency} = {rateToUSD} USD)</span>
              </div>
            )}
            <DialogFooter className="mt-4 flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isLoading}>{t('cancel') || "Отмена"}</Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>{t('confirm') || "Подтвердить"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>

  )
}
