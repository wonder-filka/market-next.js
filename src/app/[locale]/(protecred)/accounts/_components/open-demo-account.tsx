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
import { toast } from "sonner"
import { createDemoAccount } from "../_actions"

interface OpenAccountProps {
  userId: string
}

export const OpenDemoAccount = ({ userId }: OpenAccountProps) => {
  const t = useI18n()
  const [pending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        await createDemoAccount({ userId });
        toast.success(t("demoAccountCreated"), {
          style: { color: 'white', backgroundColor: 'green' }
        })
        setOpen(false)
      } catch (error) {
        toast.error(t("demoAccountCreationFailed"), {
          style: { color: 'white', backgroundColor: 'red' }
        })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="">
          <PlusIcon className="mr-2 h-4 w-4" />
          {t("openDemoAccount")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("demoAccountTitle")}</DialogTitle>
          <DialogDescription>
            {t("demoAccountConfirmation")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {t("create")}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t("cancel")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
