'use client'

import { useQuoteStore } from "@/stores/chart-store"
import { useCurrentLocale, useI18n } from "@/locales/client"
import { LiveQuote, Quote } from "@/lib/types"
import { quoteNames } from "@/lib/constants"
import { useEffect, useState } from "react"
import { socket } from "@/socket"

export function TopLosers() {
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
  const losers = liveQuotes
    .filter(q => q.change !== null && q.change < -0.01)
    .sort((a, b) => a.change! - b.change!)
    .slice(0, 5)

  return (
    <div className="p-4 border rounded-lg shadow-sm ">
      <h2 className="text-lg font-semibold mb-2">{t("topLosersTitle")}</h2>
      {losers.length === 0 ? (
        <div className="text-sm text-muted-foreground">{t("noLosersData")}</div>
      ) : (
        <ul className="space-y-1 text-sm">
          {losers.map((q) => (
            <li key={q.symbol} className="flex justify-between cursor-pointer" onClick={() => setSelectedSymbol(q)} >
              <span> {quoteNames[q.symbol]?.[locale] ?? q.name}</span>
              <span className="text-red-500 font-medium">
                {q.change?.toFixed(4)}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
