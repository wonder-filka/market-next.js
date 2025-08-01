'use client'

import { useQuoteStore } from "@/stores/chart-store"
import { useCurrentLocale, useI18n } from "@/locales/client"
import { LiveQuote } from "@/lib/types"
import { quoteNames } from "@/lib/constants"
import { useEffect, useState } from "react"
import { socket } from "@/socket"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { LoaderCircle } from "lucide-react"
import { UserAsset } from "@/generated/prisma"
import { onQuotesUpdate } from '../../_actions/helpers'

export function TopLosers({ userAssets }: { userAssets: UserAsset[] }) {
  const t = useI18n()
  const locale = useCurrentLocale()
  const [liveQuotes, setLiveQuotes] = useState<LiveQuote[]>([]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    const onQuotesUpdates = (newQuotes: LiveQuote[]) => {
      onQuotesUpdate(newQuotes, userAssets, setLiveQuotes);
    };

    socket.on("quotes-update", onQuotesUpdates);
    return () => {
      socket.off("quotes-update", onQuotesUpdates);
    };
  }, [userAssets])
  const setSelectedSymbol = useQuoteStore((state) => state.setSelectedSymbol)
  const losers = liveQuotes
    .filter(q => q.change !== null && q.change < -0.01)
    .sort((a, b) => a.change! - b.change!)
    .slice(0, 5)

  if (losers.length === 0) {
    return <div className='flex justify-center items-center space-x-2'>
      <LoaderCircle size={25} className='text-gray-500 animate-spin' />
    </div>
  }


  return (
    <Card>
      <CardHeader className="text-xl font-semibold">{t("topLosersTitle")}</CardHeader>
      <CardContent>
        <ul className="space-y-1 text-sm">
          {losers.map((q) => (
            <li key={q.symbol} className="flex justify-between cursor-pointer" onClick={() => setSelectedSymbol(q.symbol)} >
              <span> {quoteNames[q.symbol]?.[locale] ?? q.name}</span>
              <span className="text-red-500 font-medium">
                {q.change?.toFixed(4)}%
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
