'use client'

import { useState, useTransition } from "react"
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/locales/client"
import { PlusIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { createAccount } from "../_actions"

interface OpenAccountProps {
  userId: string
}

export const OpenAccount = ({ userId }: OpenAccountProps) => {
  const t = useI18n()
  const [pending, startTransition] = useTransition()
  const [currency, setCurrency] = useState("")
  const [open, setOpen] = useState(false)

  const currencies = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" },
    { code: "RUB", symbol: "₽" }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const result = await createAccount(currency, userId)
      if ("id" in result) {
        toast.success(t("accountCreated"), {
          style: { color: 'white', backgroundColor: 'green' }
        })

      } else {
        toast.error(t("accountCreationFailed"), {
          style: { color: 'white', backgroundColor: 'red' }
        })
      }
      setOpen(false)
      setCurrency("")
    })
  }

  const CurrencyBox = ({
    code,
    symbol,
    selected,
    onClick
  }: {
    code: string
    symbol: string
    selected: boolean
    onClick: () => void
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "border rounded-md px-4 py-2 text-sm w-full flex justify-between items-center transition-all",
        selected
          ? "border-blue-700 bg-blue-100 text-blue-900"
          : "border-muted bg-background hover:bg-muted"
      )}
    >
      <span>{code}</span>
      <span className="text-lg font-medium">{symbol}</span>
    </button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-blue-900">
          <PlusIcon className="mr-2 h-4 w-4" />
          {t("openAccount")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("openAccountTitle")}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div>
            <label className="block mb-1 text-sm font-medium">{t("currency")}</label>
            <div className="flex flex-col gap-3">
              {currencies.map((cur) => (
                <CurrencyBox
                  key={cur.code}
                  code={cur.code}
                  symbol={cur.symbol}
                  selected={currency === cur.code}
                  onClick={() => setCurrency(cur.code)}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={pending || !currency}>
              {t("createAccount")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
