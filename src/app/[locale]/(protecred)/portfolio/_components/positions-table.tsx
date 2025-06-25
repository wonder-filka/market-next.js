'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useI18n } from "@/locales/client"
import { Card, CardContent } from "@/components/ui/card"

const assetNames: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  SOL: "Solana",
  ADA: "Cardano",
  BNB: "Binance Coin",
  DOGE: "Dogecoin",
  XRP: "Ripple"
}

export function PositionsTable({ positions }: { positions: any[] }) {
  const t = useI18n()

  const statusVariant = {
    Active: "default",
    Closed: "secondary",
    Liquidated: "destructive"
  }

  const formatCurrency = (value: number) =>
    value.toLocaleString("en-US", { style: "currency", currency: "USD" })

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric"
    })

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("tableAsset")}</TableHead>
              <TableHead>{t("tableName")}</TableHead>
              <TableHead>{t("tableShares")}</TableHead>
              <TableHead>{t("tablePrice")}</TableHead>
              <TableHead>{t("tableChange")}</TableHead>
              <TableHead>{t("tableTotalCost")}</TableHead>
              <TableHead>{t("tableMarketValue")}</TableHead>
              <TableHead>{t("tableGain")}</TableHead>
              <TableHead>{t("tableReturn")}</TableHead>
              <TableHead>{t("tableActions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((pos) => {
              const returnPercentage = ((pos.pnl / (pos.entry * pos.quantity)) * 100).toFixed(2)
              const totalCost = pos.entry * pos.quantity
              const marketValue = pos.current * pos.quantity
              const name = assetNames[pos.asset] || pos.asset
              return (
                <TableRow key={pos.id}>
                  <TableCell>
                    <div className="font-medium flex items-center gap-1">
                      <Badge variant="outline">{pos.asset}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>{name}</TableCell>
                  <TableCell>{pos.quantity}</TableCell>
                  <TableCell>{formatCurrency(pos.current)}</TableCell>
                  <TableCell>
                    <span className={`flex items-center gap-1 font-medium ${pos.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {pos.pnl >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      {formatCurrency(pos.current - pos.entry)}
                    </span>
                  </TableCell>
                  <TableCell>{formatCurrency(totalCost)}</TableCell>
                  <TableCell>{formatCurrency(marketValue)}</TableCell>
                  <TableCell>
                    <span className={`flex items-center gap-1 font-medium ${pos.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {pos.pnl >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      {formatCurrency(pos.pnl)}
                    </span>
                  </TableCell>
                  <TableCell className={pos.pnl >= 0 ? "text-green-600" : "text-red-600"}>{returnPercentage}%</TableCell>
                  <TableCell>
                    <button className="text-sm font-medium text-blue-500 hover:underline">
                      {t("edit")}
                    </button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}