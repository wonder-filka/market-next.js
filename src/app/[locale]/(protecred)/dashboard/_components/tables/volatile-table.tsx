'use client'

import { useEffect, useState } from 'react'
import { useQuoteStore } from '@/stores/chart-store'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { useCurrentLocale, useI18n } from '@/locales/client'
import { LiveQuote } from '@/lib/types'
import { quoteNames } from '@/lib/constants'
import { socket } from '@/socket'
import { LoaderCircle } from 'lucide-react'

export function VolatileTable() {
  const t = useI18n()
  const locale = useCurrentLocale()
  const [liveQuotes, setLiveQuotes] = useState<LiveQuote[]>([]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    function onQuotesUpdate(newQuotes: LiveQuote[]) {
      setLiveQuotes(newQuotes);
    }
    socket.on("quotes-update", onQuotesUpdate);

    return () => {
      socket.off("quotes-update", onQuotesUpdate);
    };
  }, [])


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
    return <div className='flex justify-center items-center space-x-2'>
      <LoaderCircle size={25} className='text-gray-500 animate-spin' />
    </div>
  }
  return (
    <div className="border rounded-md p-4 bg-background space-y-4">
      <h2 className="text-xl font-semibold">{t('mostVolatileTitle')}</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted-foreground border-b">
            <th className="text-left p-2">{t('columnMarket')}</th>
            <th className="text-left py-2">{t('columnVolatility')}</th>
            <th className="text-left py-2">{t('columnSell')}</th>
            <th className="text-left py-2">{t('columnBuy')}</th>
            <th className="text-left py-2">{t('columnChange')}.</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {withVolatility.map((q) => {
            const previous = q.history[q.history.length - 2]?.price ?? q.price
            const diff = q.price - previous
            const percent = previous !== 0 ? (diff / previous) * 100 : 0
            const isPositive = diff >= 0
            return (
              <tr
                key={q.symbol}
                className="border-b hover:bg-muted cursor-pointer"
                onClick={() => setSelectedSymbol(q.symbol)}
              >
                <td className="p-2 font-medium">
                  {quoteNames[q.symbol]?.[locale] ?? q.name}
                </td>
                <td>
                  <Progress value={Math.min(q.volatility * 10, 100)} className="w-24 h-2" />
                </td>
                <td className="text-start">{q.sell?.toFixed(4) ?? '—'}</td>
                <td className="text-start">{q.buy?.toFixed(4) ?? '—'}</td>
                <td className={cn('text-center', isPositive ? 'text-green-600' : 'text-red-600')}>
                  {diff >= 0 ? '+' : ''}
                  {diff.toFixed(2)}
                </td>
                <td className={cn('text-center', percent >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {percent >= 0 ? '+' : ''}
                  {percent.toFixed(2)}%
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
