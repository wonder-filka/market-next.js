'use client'

import { Progress } from "@/components/ui/progress"
import { useI18n } from "@/locales/client"
import { LiveQuote, Quote } from "@/lib/types"
import { useEffect, useState } from "react"
import { socket } from "@/socket"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { LoaderCircle } from "lucide-react"

const symbolCategories: Record<string, string> = {
  "^NDX": "indices",
  "^GSPC": "indices",
  "^DJI": "indices",
  "BTC-USD": "crypto",
  "ETH-USD": "crypto",
  "GC=F": "commodities",
  "CL=F": "commodities",
  "COMT": "commodities",
}

function groupByCategory(quotes: Quote[]) {
  const categories: Record<string, Quote[]> = {}
  for (const q of quotes) {
    const category = symbolCategories[q.symbol] ?? "other"
    if (!categories[category]) categories[category] = []
    categories[category].push(q)
  }
  return categories
}

export function CategoryPanel() {
  const t = useI18n()
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


  const categories = groupByCategory(liveQuotes)

  const maxAbsChange = Math.max(
    ...Object.values(categories).map((qs) =>
      Math.abs(qs.reduce((acc, q) => acc + q.change, 0) / qs.length)
    )
  )

  if (Object.entries(categories).length === 0) {
    return <div className='flex justify-center items-center space-x-2'>
      <LoaderCircle size={25} className='text-gray-500 animate-spin' />
    </div>
  }

  return (
    <Card>
      <CardHeader className="text-xl font-semibold">{t("activeMarkets")}</CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(categories).map(([category, quotes]) => {
            const avgChange = quotes.reduce((acc, q) => {
              const prev = q.history[q.history.length - 2]?.price ?? q.price;
              const percent = prev ? ((q.price - prev) / prev) * 100 : 0;
              return acc + percent;
            }, 0) / quotes.length;
            return (
              <div key={category}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{t(category as keyof typeof t)}</span>
                  <span className={avgChange >= 0 ? "text-green-600" : "text-red-600"}>
                    {avgChange.toFixed(2)}%
                  </span>
                </div>
                <Progress value={(Math.abs(avgChange) / maxAbsChange) * 100} />
              </div>
            )
          })}
        </div>
        {/* 
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          {t("mostPopularInCategory")}
        </h3>

        {Object.entries(categories).map(([category, quotes]) => (
          <div key={category}>
            <h4 className="text-xs text-muted-foreground">{t(category)}</h4>
            <div className="flex flex-wrap gap-2 mb-2">
              {quotes
                .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
                .slice(0, 3)
                .map((q) => (
                  <Badge
                    key={q.symbol}
                    variant="outline"
                    className="px-3 py-1 rounded-full border"
                  >
                    {q.name}
                  </Badge>
                ))}
            </div>
          </div>
        ))}
      </div> */}
      </CardContent>
    </Card>
  )
}
