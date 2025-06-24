'use client'

import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { useI18n } from "@/locales/client"

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
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("tableId")}</TableHead>
            <TableHead>{t("tableDate")}</TableHead>
            <TableHead>{t("tableAsset")}</TableHead>
            <TableHead>{t("tableType")}</TableHead>
            <TableHead>{t("tableQuantity")}</TableHead>
            <TableHead>{t("tableEntry")}</TableHead>
            <TableHead>{t("tableCurrent")}</TableHead>
            <TableHead>{t("tablePnL")}</TableHead>
            <TableHead>{t("tableStatus")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.map((pos) => (
            <TableRow key={pos.id}>
              <TableCell>{pos.id}</TableCell>
              <TableCell>{formatDate(pos.date)}</TableCell>
              <TableCell><Badge variant="outline">{pos.asset}</Badge></TableCell>
              <TableCell>
                <Badge variant={pos.type === "Buy" ? "default" : "secondary"}>
                  {t(pos.type === "Buy" ? "typeBuy" : "typeSell")}
                </Badge>
              </TableCell>
			  
              <TableCell>{pos.quantity}</TableCell>
              <TableCell>{formatCurrency(pos.entry)}</TableCell>
              <TableCell>{formatCurrency(pos.current)}</TableCell>
              <TableCell>
                <span className={`flex items-center gap-1 font-medium ${pos.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {pos.pnl >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {formatCurrency(pos.pnl)}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant[pos.status as keyof typeof statusVariant]}>
                  {t(`status${pos.status}`)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
