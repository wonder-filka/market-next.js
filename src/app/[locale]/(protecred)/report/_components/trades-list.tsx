'use client'

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/helpers"
import { Trade } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/locales/client"
import {
  ToggleGroup, ToggleGroupItem
} from "@/components/ui/toggle-group"
import { isWithinInterval, isSameDay, parse, subDays } from "date-fns"
import { X, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

const statusVariant: Record<Trade["status"], "default" | "secondary" | "destructive"> = {
  Completed: "default",
  Pending: "secondary",
  Cancelled: "destructive"
}

export function TradesList({ data }: { data: Trade[] }) {
  const t = useI18n()
  const [filter, setFilter] = useState<'day' | 'week' | 'month' | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const now = new Date()

  const filteredTrades = data.filter((trade) => {
    const end = parse(trade.endDate, "yyyy-MM-dd HH:mm", new Date())

    if (selectedDate) {
      return isSameDay(end, selectedDate)
    }

    if (filter) {
      const from = {
        day: subDays(now, 1),
        week: subDays(now, 7),
        month: subDays(now, 30),
      }[filter]
      return isWithinInterval(end, { start: from, end: now })
    }

    return true
  })

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4 items-center mt-4">
          <ToggleGroup
            type="single"
            value={filter ?? undefined}
            onValueChange={(val) => {
              setSelectedDate(null)
              setFilter(val as typeof filter)
            }}
          >
            <ToggleGroupItem value="day">{t("filterDay")}</ToggleGroupItem>
            <ToggleGroupItem value="week">{t("filterWeek")}</ToggleGroupItem>
            <ToggleGroupItem value="month">{t("filterMonth")}</ToggleGroupItem>
          </ToggleGroup>

          {filter && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFilter(null)}
              title={t("resetFilter")}
            >
              <X className="w-4 h-4" />
            </Button>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex gap-2 items-center"
              >
                <CalendarIcon className="w-4 h-4" />
                {selectedDate
                  ? format(selectedDate, 'yyyy-MM-dd')
                  : t("selectDate")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate ?? undefined}
                onSelect={(date) => {
                  setSelectedDate(date ?? null)
                  setFilter(null) // disable range filter
                }}
   
              />
            </PopoverContent>
          </Popover>

          {selectedDate && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDate(null)}
              title={t("resetDate")}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("tableTradeId")}</TableHead>
              <TableHead>{t("tableTradePeriod")}</TableHead>
              <TableHead>{t("tableTradeAsset")}</TableHead>
              <TableHead>{t("tableTradeType")}</TableHead>
              <TableHead>{t("tableTradeQuantity")}</TableHead>
              <TableHead>{t("tableTradePrice")}</TableHead>
              <TableHead>{t("tableTradeTotal")}</TableHead>
              <TableHead>{t("tableTradeStatus")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrades.map((trade) => (
              <TableRow key={trade.id}>
                <TableCell>{trade.id}</TableCell>
                <TableCell>{trade.startDate} – {trade.endDate}</TableCell>
                <TableCell>{trade.asset}</TableCell>
                <TableCell>{t(`type${trade.type}`)}</TableCell>
                <TableCell>{trade.quantity}</TableCell>
                <TableCell>{formatCurrency(trade.price)}</TableCell>
                <TableCell>{formatCurrency(trade.total)}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[trade.status]}>
                    {t(`status${trade.status}`)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
