'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/locales/client'
import { useState } from 'react'

type TradeDialogProps = {
  isOpen: boolean
  onClose: () => void
  type: 'buy' | 'sell'
  assetName: string
}

export function TradeDialog({ isOpen, onClose, type, assetName }: TradeDialogProps) {
  const t = useI18n()
  const [quantity, setQuantity] = useState('')
  const [takeProfit, setTakeProfit] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [lotSize, setLotSize] = useState('')

  const handleSubmit = () => {
    // здесь логика отправки данных
    console.log({ quantity, takeProfit, stopLoss, lotSize })
    onClose()
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

          <div>
            <label className="block text-sm font-medium mb-1">{t('lotSize')}</label>
            <Input
              type="number"
              value={lotSize}
              onChange={(e) => setLotSize(e.target.value)}
              placeholder="1"
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button onClick={handleSubmit}>
            {type === 'buy' ? t('buy') : t('sell')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
