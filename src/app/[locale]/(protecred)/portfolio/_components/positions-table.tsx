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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as React from "react"

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
  const [openDialogId, setOpenDialogId] = React.useState<string | null>(null)
  const [activeAction, setActiveAction] = React.useState<'buy' | 'sell' | null>(null)
  const [amount, setAmount] = React.useState<number | "">("")
  const [selectedPosition, setSelectedPosition] = React.useState<any | null>(null)

  const formatCurrency = (value: number) =>
    value.toLocaleString("en-US", { style: "currency", currency: "USD" })

  const handleSubmit = () => {
    console.log("Submit action:", activeAction, "amount:", amount, selectedPosition)
    setAmount("")
    setActiveAction(null)
    setOpenDialogId(null)
  }

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
              <TableHead>{t("tableGain")}</TableHead>
              <TableHead>{t("tableReturn")}</TableHead>
              <TableHead>{t("tableActions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((pos) => {
              const returnPercentage = ((pos.pnl / (pos.entry * pos.quantity)) * 100).toFixed(2)
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
                  <TableCell>
                    <span className={`flex items-center gap-1 font-medium ${pos.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {pos.pnl >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      {formatCurrency(pos.pnl)}
                    </span>
                  </TableCell>
                  <TableCell className={pos.pnl >= 0 ? "text-green-600" : "text-red-600"}>{returnPercentage}%</TableCell>
                  <TableCell>
                    <Dialog
                      open={openDialogId === pos.id}
                      onOpenChange={(isOpen) => {
                        if (!isOpen) {
                          setAmount("")
                          setActiveAction(null)
                          setSelectedPosition(null)
                        } else {
                          setSelectedPosition(pos)
                        }
                        setOpenDialogId(isOpen ? pos.id : null)
                      }}>
                      <DialogTrigger asChild>
                        <Button variant="link" className="text-blue-400 p-0 m-0">
                          {t("edit")}
                        </Button>
                      </DialogTrigger>
                      {openDialogId === pos.id && (
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{t("editPosition")}: {pos.asset}</DialogTitle>
                            <DialogDescription></DialogDescription>
                          </DialogHeader>
                          <div className="flex gap-4 mt-4">
                            <Button variant={activeAction === 'buy' ? 'default' : 'secondary'} onClick={() => setActiveAction("buy")}>{t("buyMore")}</Button>
                            <Button variant={activeAction === 'sell' ? 'default' : 'secondary'} onClick={() => setActiveAction("sell")}>{t("sellPart")}</Button>
                          </div>
                          {activeAction && (
                            <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className="mt-4 space-y-4">
                              <Input
                                type="number"
                                min="0"
                                step="any"
                                value={amount}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value)
                                  setAmount(isNaN(val) ? "" : val)
                                }}

                                placeholder="0.00"
                              />
                              <Button type="submit" disabled={!amount}>{t("save")}</Button>
                            </form>
                          )}
                        </DialogContent>
                      )}
                    </Dialog>
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
