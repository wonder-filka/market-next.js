'use client'

import { useEffect, useState } from 'react'
import { useQuoteStore } from '@/stores/chart-store'
import { cn } from '@/lib/utils'
import { useCurrentLocale, useI18n } from '@/locales/client'
import { LiveQuote } from '@/lib/types'
import { quoteNames } from '@/lib/constants'
import { socket } from '@/socket'
import { LoaderCircle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { UserAsset } from '@/generated/prisma'
import { onQuotesUpdate } from '../../_actions/helpers'
import { useQuotesStore } from '@/stores/quotes-store'

export function VolatileTable({ userAssets }: { userAssets: UserAsset[] }) {
  const t = useI18n()
  const locale = useCurrentLocale()
  const { liveQuotes, setLiveQuotes } = useQuotesStore()

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    const onQuotesUpdates = (newQuotes: LiveQuote[]) => {
      onQuotesUpdate(newQuotes, userAssets, setLiveQuotes);
      console.log('Quotes updated:', newQuotes);
    };

    socket.on("quotes-update", onQuotesUpdates);
    return () => {
      socket.off("quotes-update", onQuotesUpdates);
    };
  }, [userAssets, setLiveQuotes])

  const setSelectedSymbol = useQuoteStore((state) => state.setSelectedSymbol)

  const withVolatility = liveQuotes
    .map((q) => {
      const prices = q.history.map((p) => p.price)
      const volatility = Math.max(...prices) - Math.min(...prices)
      return { ...q, volatility }
    })
    .sort((a, b) => b.volatility - a.volatility)
    .slice(0, 10)

  if (liveQuotes.length === 0) {
    return <div className='w-full flex justify-center items-center space-x-2'>
      <LoaderCircle size={25} className='text-gray-500 animate-spin' />
    </div>
  }
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow >
              <TableHead>{t('columnMarket')}</TableHead>
              {/* <TableHead>{t('columnVolatility')}</TableHead> */}
              <TableHead>{t('columnSell')}</TableHead>
              <TableHead>{t('columnBuy')}</TableHead>
              <TableHead>{t('columnChange')}</TableHead>
              <TableHead>%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withVolatility.map((q) => {
              const previous = q.history[q.history.length - 2]?.price ?? q.price
              const diff = q.price - previous
              const percent = previous !== 0 ? (diff / previous) * 100 : 0
              const isPositive = diff >= 0
              return (
                <TableRow
                  key={q.symbol}
                  className="cursor-pointer"
                  onClick={() => setSelectedSymbol(q.symbol)}
                >
                  <TableCell className="p-2 font-medium">
                    {quoteNames[q.symbol]?.[locale] ?? q.name}
                  </TableCell>
                  {/* <TableCell>
                    <Progress value={Math.min(q.volatility * 10, 100)} className="w-24 h-2" />
                  </TableCell> */}
                  <TableCell className="text-start">{q.sell ?? '—'}</TableCell>
                  <TableCell className="text-start">{q.buy ?? '—'}</TableCell>
                  <TableCell className={cn('text-center', isPositive ? 'text-green-600' : 'text-red-600')}>
                    {diff >= 0 ? '+' : ''}
                    {diff.toFixed(2)}
                  </TableCell>
                  <TableCell className={cn('text-center', percent >= 0 ? 'text-green-600' : 'text-red-600')}>
                    {percent >= 0 ? '+' : ''}
                    {percent.toFixed(2)}%
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
