'use client'

import { useQuoteStore } from "@/stores/chart-store"
import { useCurrentLocale, useI18n } from "@/locales/client"
import { quoteNames } from "@/lib/constants"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useQuotesStore } from "@/stores/quotes-store"
import { getPercent } from "../../_actions/helpers"

export function TopGainers() {
  const t = useI18n()
  const locale = useCurrentLocale()
  const { liveQuotes } = useQuotesStore()

  const setSelectedSymbol = useQuoteStore((state) => state.setSelectedSymbol)
  // пересчитываем процент для каждого q
  const gainers = liveQuotes
    .map(q => ({
      ...q,
      percent: getPercent(q)
    }))
    .filter(q => q.percent > 0.01)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 5)

  if (gainers.length === 0) return null

  return (
    <Card>
      <CardHeader className="text-lg font-semibold">{t("topGainersTitle")}</CardHeader>
      <CardContent>
        <ul className="space-y-1 text-sm" >
          {gainers.map((q) => (
            <li key={q.symbol} className="flex justify-between cursor-pointer" onClick={() => setSelectedSymbol(q.symbol)}>
              <span>{quoteNames[q.symbol]?.[locale] ?? q.name}</span>
              <span className="text-green-500 font-medium">
                {q.percent >= 0 ? "+" : ""}
                {q.percent.toFixed(2)}%
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
