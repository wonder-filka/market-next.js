'use client'

import { useQuoteStore } from "@/stores/chart-store"
import { useCurrentLocale, useI18n } from "@/locales/client"
import { quoteNames } from "@/lib/constants"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useQuotesStore } from "@/stores/quotes-store"
import { getPercent } from "../../_actions/helpers"

export function TopLosers() {
  const t = useI18n()
  const locale = useCurrentLocale()
  const { liveQuotes } = useQuotesStore()
  const setSelectedSymbol = useQuoteStore((state) => state.setSelectedSymbol)

  const losers = liveQuotes
    .map(q => ({
      ...q,
      percent: getPercent(q)
    }))
    .filter(q => q.percent < -0.01)
    .sort((a, b) => a.percent - b.percent)
    .slice(0, 5)

  if (losers.length === 0) return null
   

  return (
    <Card>
      <CardHeader className="text-xl font-semibold">{t("topLosersTitle")}</CardHeader>
      <CardContent>
        <ul className="space-y-1 text-sm">
          {losers.map((q) => (
            <li key={q.symbol} className="flex justify-between cursor-pointer" onClick={() => setSelectedSymbol(q.symbol)} >
              <span>{quoteNames[q.symbol]?.[locale] ?? q.name}</span>
              <span className="text-red-500 font-medium">
                {q.percent.toFixed(2)}%
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
