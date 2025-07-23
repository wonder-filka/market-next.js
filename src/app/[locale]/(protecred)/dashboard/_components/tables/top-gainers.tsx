'use client'

import { useQuoteStore } from "@/stores/chart-store"
import { useCurrentLocale, useI18n } from "@/locales/client"
import { LiveQuote } from "@/lib/types"
import { quoteNames } from "@/lib/constants"
import { socket } from "@/socket"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function TopGainers() {
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
  const gainers = liveQuotes
    .filter(q => q.change !== null && q.change > 0.01)
    .sort((a, b) => b.change! - a.change!)
    .slice(0, 5)

  return (
    <Card>
      <CardHeader className="text-lg font-semibold">{t("topGainersTitle")}</CardHeader>
      <CardContent>
        {gainers.length === 0 ? (
          <div className="text-sm text-muted-foreground">{t("noGainersData")}</div>
        ) : (
          <ul className="space-y-1 text-sm" >
            {gainers.map((q) => (
              <li key={q.symbol} className="flex justify-between cursor-pointer" onClick={() => setSelectedSymbol(q.symbol)}>
                <span>{quoteNames[q.symbol]?.[locale] ?? q.name}</span>
                <span className="text-green-500 font-medium">
                  +{q.change?.toFixed(4)}%
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
