'use client'

import { useState } from "react"
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useI18n } from "@/locales/client"
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem
} from "@/components/ui/select"
import { useRouter } from "next/navigation"

export const ActionsPanel = () => {
  const t = useI18n()
    const router = useRouter()
  const [openType, setOpenType] = useState<"buy" | "sell" | null>(null)
  const [asset, setAsset] = useState("")
  const [quantity, setQuantity] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(`${openType === "buy" ? "🟢 Buy" : "🔴 Sell"}:`, { asset, quantity })
    setAsset("")
    setQuantity("")
    setOpenType(null)
  }

  return (
    <Button variant="default" className="max-w-36" onClick={() => router.push('/dashboard')}>{t('trade')}</Button>
    // <div className="flex flex-col md:flex-row items-start md:items-center gap-3 justify-between">
    //   <div className="flex gap-2">
    //     <Dialog open={openType !== null} onOpenChange={(isOpen) => !isOpen && setOpenType(null)}>
    //       <DialogTrigger asChild>
    //         <Button variant="default" onClick={() => setOpenType("buy")}>
    //           {t("buyAsset")}
    //         </Button>
    //       </DialogTrigger>
    //       <DialogTrigger asChild>
    //         <Button variant="secondary" onClick={() => setOpenType("sell")}>
    //           {t("sellAsset")}
    //         </Button>
    //       </DialogTrigger>

    //       <DialogContent>
    //         <DialogHeader>
    //           <DialogTitle>
    //             {openType === "buy" ? t("buyAssetTitle") : t("sellAssetTitle")}
    //           </DialogTitle>
    //           <DialogDescription></DialogDescription>
    //         </DialogHeader>
    //         <form onSubmit={handleSubmit} className="space-y-4 mt-4">
    //           <div>
    //             <label className="block mb-1 text-sm font-medium">{t("selectAsset")}</label>
    //             <Select value={asset} onValueChange={setAsset}>
    //               <SelectTrigger>
    //                 <SelectValue placeholder={t("selectAsset")} />
    //               </SelectTrigger>
    //               <SelectContent>
    //                 <SelectItem value="BTC">BTC</SelectItem>
    //                 <SelectItem value="ETH">ETH</SelectItem>
    //                 <SelectItem value="SOL">SOL</SelectItem>
    //                 <SelectItem value="XRP">XRP</SelectItem>
    //               </SelectContent>
    //             </Select>
    //           </div>
    //           <div>
    //             <label className="block mb-1 text-sm font-medium">{t("quantity")}</label>
    //             <Input
    //               type="number"
    //               value={quantity}
    //               onChange={(e) => setQuantity(e.target.value)}
    //               placeholder="0.00"
    //             />
    //           </div>
    //           <DialogFooter>
    //             <Button type="submit">
    //               {openType === "buy" ? t("confirmBuy") : t("confirmSell")}
    //             </Button>
    //           </DialogFooter>
    //         </form>
    //       </DialogContent>
    //     </Dialog>
    //   </div>
    // </div>
  )
}
