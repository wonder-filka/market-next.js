'use client'

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/locales/client"
import { Quote } from "@/lib/types"

type Props = {
  initialQuotes: Quote[]
}

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

export function CategoryPanel({ initialQuotes }: Props) {
  const t = useI18n()
  const categories = groupByCategory(initialQuotes)

  return (
    <div className="border rounded-md p-4 bg-background space-y-6">
      <h2 className="text-xl font-semibold">{t("activeMarkets")}</h2>

      <div className="space-y-3">
        {Object.entries(categories).map(([category, quotes]) => {
          const totalChange = quotes.reduce((acc, q) => acc + q.change, 0)
          const avgChange = totalChange / quotes.length

          return (
            <div key={category}>
              <div className="flex justify-between text-sm mb-1">
                <span>{t(category)}</span>
                <span className="text-muted-foreground">{avgChange.toFixed(2)}%</span>
              </div>
              <Progress value={Math.min(Math.abs(avgChange) * 10, 100)} />
            </div>
          )
        })}
      </div>

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
      </div>
    </div>
  )
}
