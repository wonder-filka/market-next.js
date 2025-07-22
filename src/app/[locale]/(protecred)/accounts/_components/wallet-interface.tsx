'use client'

import { Download, ArrowUpRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useI18n } from "@/locales/client"
import { formatter, getCurrencySymbol } from "@/lib/helpers"
import { Account, Wallet } from "@/generated/prisma"
import { TransferDialog } from "./transfer-dialog"
import { useState } from "react"

type WalletProps = {
  wallet: Wallet,
  userId: string,
  accounts: Account[]
  rates: Record<string, number>
}

export default function WalletInterface({ wallet, userId, accounts, rates }: WalletProps) {
  const t = useI18n()
  const [isTransferOpen, setIsTransferOpen] = useState(false);


  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex justify-start">
        <span className="text-2xl font-bold">{t("walletTitle")}</span>

      </div>
      <Card>
        <CardContent className="flex flex-col gap-8 md:flex-row justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">{t("walletTitle")}</p>
            <p className="text-3xl font-bold">
              {getCurrencySymbol(wallet.currency)} {wallet.balance.toLocaleString()}
            </p>
          </div>
            <div>
            <p className="text-sm text-muted-foreground">{t("freeMargin")}</p>
            <p className="text-3xl font-bold">
               {getCurrencySymbol(wallet.currency)}   {wallet.balance - wallet.withdrawn > 0
    ? formatter.format(wallet.balance - wallet.withdrawn)
    : formatter.format(0)}
            </p>
          </div>
          <div className="flex flex-col gap-8 md:flex-row ">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              {t("withdrawFunds")}
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsTransferOpen(true)}>
              <ArrowUpRight className="h-4 w-4" />
              {t("transferFunds")}
            </Button>
            <Button>
              <Plus className="h-4 w-4" />
              {t("depositFunds")}
            </Button>
          </div>
        </CardContent>
      </Card>
      <TransferDialog
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        accounts={accounts}
        userId={userId}
        wallet={wallet}
        rates={rates}
      />
    </div>
  )
}
