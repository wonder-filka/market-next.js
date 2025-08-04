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
import { ArrowUpRight, ArrowDownRight, LoaderCircle } from "lucide-react"
import { useCurrentLocale, useI18n } from "@/locales/client"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { closePosition } from "../_actions"
import { toast } from "sonner"
import { createTrade } from "../../dashboard/_actions"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { quoteNames } from "@/lib/constants"
import { useQuotesStore } from '@/stores/quotes-store'
import { socket } from "@/socket"
import { LiveQuote } from "@/lib/types"
import { onQuotesUpdate } from "../../dashboard/_actions/helpers"
import { Position, Account, UserAsset } from "../../../../../../prisma/generated/prisma"

function convert(amount: number, currency: string, rates: Record<string, number | undefined>) {
  if (currency === 'USD') return amount;
  const rate = rates[currency] ?? 1;
  return amount * rate;
}


export function PositionsTable({ positions, userId, accounts, rates, userAssets }: { positions: Position[], userId: string, accounts: Account[], rates: Record<string, number>, userAssets: UserAsset[] }) {
  const t = useI18n()
  const locale = useCurrentLocale()
  const [openDialogId, setOpenDialogId] = useState<string | null>(null)
  const [activeAction, setActiveAction] = useState<'buy' | 'sell' | null>(null)
  const [amount, setAmount] = useState<number | "">("")
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [accountId, setAccountId] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const { liveQuotes, setLiveQuotes } = useQuotesStore()

  const handleSubmit = async () => {
    if (!amount || !selectedPosition || !accountId) return
    const account = accounts.find(a => a.id === accountId)!;
    const quote = liveQuotes.find(q => q.symbol === selectedPosition.asset);
    const currentPrice =
      activeAction === "buy"
        ? (quote?.buy ?? selectedPosition.current)
        : (quote?.sell ?? selectedPosition.current);
    const usdValue = Number(amount) * currentPrice;

    const rate = account.currency === 'USD' ? 1 : (rates[account.currency] ?? 1);
    const requiredInAccountCurrency = usdValue * rate;
    if (account.freeMargin < requiredInAccountCurrency) {
      return toast.error(t('insufficientFunds'), {
        style: { backgroundColor: 'red', color: 'white' },
      })
    }
    await createTrade({
      userId,
      account,
      asset: selectedPosition.asset,
      type: activeAction === 'buy' ? 'buy' : 'sell',
      price: currentPrice,
      quantity: parseFloat(amount.toString()),
      takeProfit: takeProfit ? parseFloat(takeProfit) : null,
      stopLoss: stopLoss ? parseFloat(stopLoss) : null,
      rates
    })

    toast.success(t(selectedPosition.type === 'Buy' ? 'buySuccess' : 'sellSuccess'), {
      style: { backgroundColor: 'green', color: 'white' },
    })

    setAccountId("")
    setTakeProfit("")
    setStopLoss("")
    setAmount("")
    setActiveAction(null)
    setOpenDialogId(null)
  }

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    const onQuotesUpdates = (newQuotes: LiveQuote[]) => {
      onQuotesUpdate(newQuotes, userAssets, setLiveQuotes);
    };

    socket.on("quotes-update", onQuotesUpdates);
    return () => {
      socket.off("quotes-update", onQuotesUpdates);
    };
  }, [userAssets, setLiveQuotes])

  const handleClose = async (pos: Position) => {
    const quote = liveQuotes.find(q => q.symbol === pos.asset);
    const currentPrice =
      pos.type === "Buy"
        ? (quote?.buy ?? pos.current)
        : (quote?.sell ?? pos.current);
    const account = accounts.find(a => a.id === pos.accountId)!;
    try {
      console.log("currentPrice", currentPrice)
      console.log("pos.entry", pos.entry)
      await closePosition(pos, account, rates, currentPrice);
      toast.success(t("positionClosed"));
    } catch (error) {
      console.error("Error closing position:", error);
      toast.error(t("positionCloseError"));
    }
  }

  if (liveQuotes.length === 0) {
    return <div className='w-full flex justify-center items-center space-x-2'>
      <LoaderCircle size={25} className='text-gray-500 animate-spin' />
    </div>
  }

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("tableAsset")}</TableHead>
              <TableHead>{t("tableDateOpen")}</TableHead>
              <TableHead>{t("tableTradeType")}</TableHead>
              <TableHead>{t("account")}</TableHead>
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
            {positions.length > 0 ? positions.map((pos) => {
              const quote = liveQuotes.find(q => q.symbol === pos.asset);
              const currentPrice =
                pos.type === "Buy"
                  ? (quote?.buy ?? pos.current)
                  : (quote?.sell ?? pos.current);
              const gain = currentPrice - pos.entry
              const signedGain = pos.type === "Buy" ? gain : -gain
              const account = accounts.find(acc => acc.id === pos.accountId);
              const displayMt5Id = account ? account.mt5Id : "N/A"; // Показываем MT5 ID или "N/A" если не найдено
              // теперь процент:
              const pct = (signedGain / pos.entry) * 100
              // и чтобы всегда две цифры после точки:
              const pctDisplay = pct.toFixed(2) + '%'
              const isUp = pos.type === "Buy" ? gain >= 0 : gain <= 0
              const type = pos.type === "Buy" ? "typeBuy" : "typeSell"
              const pnl = pos.type === "Buy"
                ? (currentPrice - pos.entry) * pos.quantity
                : (pos.entry - currentPrice) * pos.quantity;
              return (
                <TableRow key={pos.id}>
                  <TableCell>
                    <div className="font-medium flex items-center gap-1">
                      <Badge variant="outline">{quoteNames[pos.asset]?.[locale]}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(pos.startDate), "dd.MM.yyyy, HH:mm:ss")}</TableCell>
                  <TableCell>{t(type)}</TableCell>
                  <TableCell>{displayMt5Id}</TableCell>
                  <TableCell>{pos.quantity}</TableCell>
                  <TableCell>{(pos.entry)}</TableCell>
                  <TableCell>{(currentPrice)}</TableCell>
                  <TableCell>
                    <span className={`flex items-center gap-1 font-medium ${(currentPrice - pos.entry) >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {(currentPrice - pos.entry) >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      {(currentPrice - pos.entry)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`flex items-center gap-1 font-medium ${pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {pnl >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={16} />}
                      {(pnl.toFixed(8))}
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
                            <DialogTitle>{t("editPosition")}: {quoteNames[pos.asset]?.[locale]}</DialogTitle>
                            <DialogDescription></DialogDescription>
                          </DialogHeader>
                          <div className="flex gap-4 mt-4">
                            <Button variant={activeAction === 'buy' ? 'default' : 'secondary'} onClick={() => setActiveAction("buy")}>{t("buyMore")}</Button>
                            <Button variant={activeAction === 'sell' ? 'default' : 'secondary'} onClick={() => setActiveAction("sell")}>{t("sellPart")}</Button>
                          </div>
                          {activeAction && (
                            <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className="mt-4 space-y-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">{t('account')}</label>
                                <select
                                  className="w-full bg-background border rounded-md p-2"
                                  value={accountId}
                                  onChange={(e) => setAccountId(e.target.value)}
                                >
                                  <option value="">{t('selectAccount')}</option>

                                  {accounts.map((acc) => {
                                    const converted = convert(acc.freeMargin, acc.currency, rates);

                                    return (
                                      <option key={acc.id} value={acc.id}>
                                        {acc.mt5Id} — {acc.currency} {converted}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
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
                              {amount && accountId && (() => {
                                const acc = accounts.find(a => a.id === accountId)
                                if (!acc) return null
                                const rate = acc.currency === 'USD' ? 1 : (rates[acc.currency] ?? 1)
                                const currentPrice =
                                  activeAction === "buy"
                                    ? (quote?.buy ?? pos.current)
                                    : (quote?.sell ?? pos.current);
                                const usdValue = Number(amount) * currentPrice
                                const total = usdValue * rate
                                return (
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    {t('tradeAmount')}: {(acc.currency)} {total.toFixed(2)}
                                  </p>
                                )
                              })()}

                              <div>
                                <label className="block text-sm font-medium mb-1">{t('takeProfit')}</label>
                                <Input
                                  type="number"
                                  value={takeProfit}
                                  onChange={(e) => setTakeProfit(e.target.value)}
                                  placeholder="0.00"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium mb-1">{t('stopLoss')}</label>
                                <Input
                                  type="number"
                                  value={stopLoss}
                                  onChange={(e) => setStopLoss(e.target.value)}
                                  placeholder="0.00"
                                />
                              </div>
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
                            {t('closePositionText')}: {quoteNames[pos.asset]?.[locale]}
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
            }) : <TableRow>
              <TableCell colSpan={12}>
                <div className="p-12 w-full flex justify-center items-center text-muted-foreground">
                  {t("noGainersData")}
                </div>
              </TableCell>
            </TableRow>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
