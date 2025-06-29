'use client'

import { Download, ArrowUpRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useI18n } from "@/locales/client"

type WalletProps = {
  wallet: {
    balance: number
    currency: string
  }
}

export default function WalletInterface({ wallet }: WalletProps) {
  const t = useI18n()

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
              {wallet.currency}{wallet.balance.toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col gap-8 md:flex-row ">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              {t("withdrawFunds")}
            </Button>
            <Button variant="outline">
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
    </div>
  )
}
