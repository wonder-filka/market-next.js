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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import * as React from "react"
import { closePosition } from "../_actions"
import { Position } from "@/generated/prisma"
import { toast } from "sonner"

const assetNames: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  SOL: "Solana",
  ADA: "Cardano",
  BNB: "Binance Coin",
  DOGE: "Dogecoin",
  XRP: "Ripple"
}

export function PositionsTable({ positions }: { positions: Position[] }) {
  const t = useI18n()
  const [openDialogId, setOpenDialogId] = React.useState<string | null>(null)
  const [activeAction, setActiveAction] = React.useState<'buy' | 'sell' | null>(null)
  const [amount, setAmount] = React.useState<number | "">("")
  const [selectedPosition, setSelectedPosition] = React.useState<Position | null>(null)

  const handleSubmit = () => {
    console.log("Submit action:", activeAction, "amount:", amount, selectedPosition)
    setAmount("")
    setActiveAction(null)
    setOpenDialogId(null)
  }

  const handleClose = async (pos: Position) => {
    console.log("pos:", pos)
    try {
      await closePosition(pos)
      toast.success(t("positionClosed"))
    } catch (error) {
      toast.error(t("positionCloseError"))
    }
  }

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("tableAsset")}</TableHead>
              <TableHead>{t("tableName")}</TableHead>
              <TableHead>{t("tableTradeType")}</TableHead>
              <TableHead>{t("tableShares")}</TableHead>
              <TableHead>{t("tablePrice")}</TableHead>
              <TableHead>{t("tableCurrentPrice")}</TableHead>
              <TableHead>{t("tableChange")}</TableHead>
              <TableHead>{t("tableGain")}</TableHead>
              <TableHead>{t("tableReturn")}</TableHead>
              <TableHead>{t("tableActions")}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((pos) => {
              const name = assetNames[pos.asset] || pos.asset
              const gain = pos.current - pos.entry
              const signedGain = pos.type === "Buy" ? gain : -gain

              // теперь процент:
              const pct = (signedGain / pos.entry) * 100
              // и чтобы всегда две цифры после точки:
              const pctDisplay = pct.toFixed(2) + '%'
              const isUp = pos.type === "Buy" ? gain >= 0 : gain <= 0
              const type = pos.type === "Buy" ? "typeBuy" : "typeSell"
              return (
                <TableRow key={pos.id}>
                  <TableCell>
                    <div className="font-medium flex items-center gap-1">
                      <Badge variant="outline">{pos.asset}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>{name}</TableCell>
                  <TableCell>{t(type)}</TableCell>
                  <TableCell>{pos.quantity}</TableCell>
                  <TableCell>{(pos.entry)}</TableCell>
                  <TableCell>{(pos.current)}</TableCell>
                  <TableCell>
                    <span className={`flex items-center gap-1 font-medium ${pos.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {pos.pnl >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      {(pos.current - pos.entry)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`flex items-center gap-1 font-medium ${pos.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {pos.pnl >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      {(pos.pnl)}
                    </span>
                  </TableCell>
                  <TableCell className={isUp ? "text-green-600" : "text-red-600"}>
                    {pctDisplay}
                  </TableCell>
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
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" className="text-red-500">{t("closePosition")}</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {t('closePositionText')}: {pos.asset}
                          </DialogTitle>
                          <DialogDescription>
                            {t('confirmCloseText')}
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button onClick={() => handleClose(pos)} type="submit">{t("Save changes")}</Button>
                        </DialogFooter>
                      </DialogContent>
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
