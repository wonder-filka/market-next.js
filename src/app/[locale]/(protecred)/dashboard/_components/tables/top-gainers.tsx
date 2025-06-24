'use client'

import { useQuoteStore } from "@/stores/chart-store"
import { fakeQuotes } from "../../_actions/constants"
import { useI18n } from "@/locales/client"

export function TopGainers() {
  const t = useI18n()

    const setSelectedQuote = useQuoteStore((state) => state.setSelectedQuote)
  const gainers = fakeQuotes
    .filter(q => q.change !== null && q.change > 0.01)
    .sort((a, b) => b.change! - a.change!)
    .slice(0, 5)

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-2">{t("topGainersTitle")}</h2>
      {gainers.length === 0 ? (
        <div className="text-sm text-muted-foreground">{t("noGainersData")}</div>
      ) : (
        <ul className="space-y-1 text-sm" >
          {gainers.map((q) => (
            <li key={q.symbol} className="flex justify-between cursor-pointer"  onClick={() => setSelectedQuote(q)}>
              <span>{q.name}</span>
              <span className="text-green-500 font-medium">
                +{q.change?.toFixed(4)}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
