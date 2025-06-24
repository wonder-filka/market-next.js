'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { fakeQuotes } from "../../_actions/constants"
import { useQuoteStore } from "@/stores/chart-store"
import { useI18n } from "@/locales/client"


export function VolatileTable() {
  const setSelectedQuote = useQuoteStore((state) => state.setSelectedQuote)
    const t = useI18n()
  if (!fakeQuotes) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    )
  }

  const withVolatility = fakeQuotes
    .map((q) => {
      const prices = q.history.map(p => p.price)
      const max = Math.max(...prices)
      const min = Math.min(...prices)
      const volatility = max - min
      return { ...q, volatility }
    })
    .sort((a, b) => b.volatility - a.volatility)
    .slice(0, 10)

  return (
    <div className="border rounded-md p-4 bg-background space-y-4">
      <h2 className="text-xl font-semibold">{t("mostVolatileTitle")}</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted-foreground border-b">
            <th className="text-left p-2">{t("columnMarket")}</th>
            <th>{t("columnVolatility")}.</th>
            <th>{t("columnSell")}</th>
            <th>{t("columnBuy")}</th>
            <th>{t("columnChange")}.</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {withVolatility.map((q) => {
            const previous = q.history[q.history.length - 2]?.price ?? q.price
            const diff = q.price - previous
            const isPositive = diff >= 0

            return (
           <tr key={q.symbol} className="border-b hover:bg-muted cursor-pointer" onClick={() => setSelectedQuote(q)}>
                <td className="p-2 font-medium">{q.name}</td>
                <td>
                  <Progress value={Math.min(q.volatility * 10, 100)} className="w-24 h-2" />
                </td>
                <td className="text-center">{q.sell?.toFixed(2) ?? '—'}</td>
                <td className="text-center">{q.buy?.toFixed(2) ?? '—'}</td>
                <td className={cn("text-center", isPositive ? "text-green-600" : "text-red-600")}>
                  {diff >= 0 ? "+" : ""}{diff.toFixed(2)}
                </td>
                <td className={cn("text-center", q.change >= 0 ? "text-green-600" : "text-red-600")}>
                  {q.change?.toFixed(2)}%
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
