'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/locales/client"
import { useQuotesStore } from "@/stores/quotes-store"
import { Position } from "@/generated/prisma"

interface Props {
  balance: number,
  openPositions: Position[],
}
export const SummaryCards = ({ balance, openPositions }: Props) => {
  const t = useI18n()
  const { liveQuotes } = useQuotesStore()
  const enriched = openPositions.map(pos => {
    const quote = liveQuotes.find(q => q.symbol === pos.asset)
    const current =
      pos.type === "Buy"
        ? (quote?.buy ?? pos.entry)  // если нет котировки, берём цену входа
        : (quote?.sell ?? pos.entry)
    const pnl =
      pos.type === "Buy"
        ? (current - pos.entry) * pos.quantity
        : (pos.entry - current) * pos.quantity
    return { ...pos, pnl }
  })

  const profit = enriched.filter(p => p.pnl > 0).reduce((sum, p) => sum + p.pnl, 0)
  const loss = enriched.filter(p => p.pnl < 0).reduce((sum, p) => sum + Math.abs(p.pnl), 0)
  const formatCurrency = (value: number) =>
    value.toLocaleString("en-US", { style: "currency", currency: "USD" })

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-8">
            {t("balance")}
            <Badge variant="outline">{t("currencyUSD")}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{formatCurrency(balance)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("openPositions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{openPositions.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("profit")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{formatCurrency(profit)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("loss")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600">{formatCurrency(loss)}</div>
        </CardContent>
      </Card>
    </div>
  )
}
