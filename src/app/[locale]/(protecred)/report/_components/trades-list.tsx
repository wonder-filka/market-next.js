'use client'

import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/helpers"
import { Trade } from "@/lib/types"
import { StatusBadge } from "./status-badge"
import { useI18n } from "@/locales/client"

export function TradesList({ data }: { data: Trade[] }) {
  const t = useI18n()

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("tableTradeId")}</TableHead>
              <TableHead>{t("tableTradeDate")}</TableHead>
              <TableHead>{t("tableTradeAsset")}</TableHead>
              <TableHead>{t("tableTradeType")}</TableHead>
              <TableHead>{t("tableTradeQuantity")}</TableHead>
              <TableHead>{t("tableTradePrice")}</TableHead>
              <TableHead>{t("tableTradeTotal")}</TableHead>
              <TableHead>{t("tableTradeStatus")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell>{trade.id}</TableCell>
                <TableCell>{trade.date}</TableCell>
                <TableCell>{trade.asset}</TableCell>
                <TableCell>{t(`type${trade.type}`)}</TableCell>
                <TableCell>{trade.quantity}</TableCell>
                <TableCell>{formatCurrency(trade.price)}</TableCell>
                <TableCell>{formatCurrency(trade.total)}</TableCell>
                <TableCell><StatusBadge status={trade.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
