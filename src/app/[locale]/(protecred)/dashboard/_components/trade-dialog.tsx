'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/locales/client'
import { useState, useTransition } from 'react'
import { Account } from '@/generated/prisma'
import { createTrade } from '../_actions'
import { toast } from 'sonner'

type TradeDialogProps = {
  isOpen: boolean
  onClose: () => void
  type: 'buy' | 'sell'
  assetName: string
  accounts: Account[]
  userId: string
  price: number
}

export function TradeDialog({ isOpen, onClose, type, assetName, accounts, userId, price }: TradeDialogProps) {
  const t = useI18n()
  const [quantity, setQuantity] = useState('')
  const [takeProfit, setTakeProfit] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [accountId, setAccountId] = useState('')
  const [pending, startTransition] = useTransition()

    const handleSubmit = () => {
    if (!quantity || !accountId) return

    startTransition(async () => {
      try {
        await createTrade({
          userId,
          accountId,
          asset: assetName,
          type,
          price,
          quantity: parseFloat(quantity),
          takeProfit: takeProfit ? parseFloat(takeProfit) : null,
          stopLoss: stopLoss ? parseFloat(stopLoss) : null,
        })

        toast.success(t(type === 'buy' ? 'buySuccess' : 'sellSuccess'), {
          style: { backgroundColor: 'green', color: 'white' },
        })

        onClose()
        setQuantity('')
        setTakeProfit('')
        setStopLoss('')
        setAccountId('')
      } catch (err: any) {
        toast.error(t(err.message || 'error'), {
          style: { backgroundColor: 'red', color: 'white' },
        })
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900">
        <DialogHeader>
          <DialogTitle>
            {type === 'buy' ? t('buy') : t('sell')} {assetName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('account')}</label>
            <select
              className="w-full bg-background border rounded-md p-2"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
            >
              <option value="">{t('selectAccount')}</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.mt5Id} - {acc.currency} {acc.balance.toFixed(2)}
                </option>
              ))}
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

        <DialogFooter className="pt-4">
          <Button onClick={handleSubmit} disabled={pending || !quantity || !accountId}>
            {t(type)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
