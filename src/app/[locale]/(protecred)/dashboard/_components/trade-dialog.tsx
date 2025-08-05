'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCurrentLocale, useI18n } from '@/locales/client'
import { useEffect, useState, useTransition } from 'react'
import { createTrade } from '../_actions'
import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'
import { quoteNames } from '@/lib/constants'
import { useQuotesStore } from '@/stores/quotes-store'
import { Account } from '../../../../../../prisma/generated/prisma'

type TradeDialogProps = {
  isOpen: boolean
  onClose: () => void
  type: 'buy' | 'sell'
  assetName: string
  accounts: Account[]
  userId: string
  rates: Record<string, number>
}

export function TradeDialog({ isOpen, onClose, type, assetName, accounts, userId, rates }: TradeDialogProps) {
  const t = useI18n()
  const locale = useCurrentLocale()
  const [quantity, setQuantity] = useState('')
  const [takeProfit, setTakeProfit] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [accountId, setAccountId] = useState('')
  const [pending, startTransition] = useTransition()
  const [loading, setLoading] = useState(false)
  const [currentPrice, setCurrentPrice] = useState(0)
  const { liveQuotes } = useQuotesStore()

  useEffect(() => {
    const quote = liveQuotes.find(q => q.symbol === assetName)
    if (!quote) return;
    if (type === 'buy') setCurrentPrice(quote.buy ?? 0);
    else if (type === 'sell') setCurrentPrice(quote.sell ?? 0);
  }, [type, assetName, isOpen, currentPrice, liveQuotes])

  const handleSubmit = () => {
    setLoading(true)
    if (!quantity || !accountId) return
    const qty = parseFloat(quantity)
    const totalUsd = currentPrice * qty // сколько нужно USD для сделки
    const account = accounts.find(a => a.id === accountId)!
    const rate = account.currency === 'USD' ? 1 : (rates[account.currency] ?? 1)
    const requiredInAccountCurrency = totalUsd * rate
    // 2. Проверка на наличие средств именно в валюте аккаунта!
    if (account.freeMargin < requiredInAccountCurrency) {
      setLoading(false)
      return toast.error(t('insufficientFunds'), {
        style: { backgroundColor: 'red', color: 'white' },
      })
    }
    startTransition(async () => {
      const result = await createTrade({
        userId,
        account,
        asset: assetName,
        type,
        price: currentPrice,
        quantity: parseFloat(quantity),
        takeProfit: takeProfit ? parseFloat(takeProfit) : null,
        stopLoss: stopLoss ? parseFloat(stopLoss) : null,
        rates
      })

      if ("message" in result) {
        toast.error(t("tradeCreationFailed"), {
          style: { backgroundColor: 'red', color: 'white' },
        })
      } else {
        // await new Promise(res => setTimeout(res, 5000))
        toast.success(t(type === 'buy' ? 'buySuccess' : 'sellSuccess'), {
          style: { backgroundColor: 'green', color: 'white' },
        })

        onClose()
        setQuantity('')
        setTakeProfit('')
        setStopLoss('')
        setAccountId('')
        setLoading(false)
        setCurrentPrice(0)
      }
    })
  }

  const dialogClose = () => {
    setQuantity('')
    setTakeProfit('')
    setStopLoss('')
    setAccountId('')
    setCurrentPrice(0);
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={dialogClose}>
      <DialogContent className="sm:max-w-md bg-gray-900">
        <DialogHeader>
          <DialogTitle>
            {type === 'buy' ? t('buy') : t('sell')} {quoteNames[assetName]?.[locale]}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {loading || currentPrice === 0 ? (
          <div className='flex justify-center items-center space-x-2'>
            <LoaderCircle size={25} className='text-gray-500 animate-spin' />
          </div>
        ) :
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('account')}</label>
              <select
                className="w-full bg-background border rounded-md p-2"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
              >
                <option value="">{t('selectAccount')}</option>

                {accounts.map((acc) => {
                  return (
                    <option key={acc.id} value={acc.id}>
                      {acc.mt5Id} — {acc.currency} {acc.freeMargin}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t('quantity')}</label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0.00"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{t("tableCurrentPrice")}: {currentPrice}</span>
              </div>
              {quantity && accountId && (() => {
                const acc = accounts.find(a => a.id === accountId)
                if (!acc) return null
                const rate = acc.currency === 'USD' ? 1 : (rates[acc.currency] ?? 1)
                const usdValue = Number(quantity) * currentPrice
                const total = usdValue * rate

                return (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t('tradeAmount')}: {(acc.currency)} {total.toFixed(2)}
                  </p>
                )
              })()}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t('takeProfit')}</label>
              <Input
                type="number"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t('stopLoss')}</label>
              <Input
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="0.00"
              />
            </div>

          </div>
        }
        <DialogFooter className="pt-4">
          <Button onClick={handleSubmit} disabled={pending || !quantity || !accountId || loading}>
            {t(type)}
          </Button>
        </DialogFooter>
      </DialogContent>

    </Dialog>
  )
}
