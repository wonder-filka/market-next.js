'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/locales/client"

interface Props {
  balance: number,
  openPositions: number,
  profit: number,
  loss: number,
}
export const SummaryCards = ({ balance, openPositions, profit, loss }: Props) => {
  const t = useI18n()

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
          <div className="text-3xl font-bold">{openPositions}</div>
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
