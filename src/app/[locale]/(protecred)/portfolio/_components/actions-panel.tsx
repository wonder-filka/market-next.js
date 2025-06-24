'use client'

import { Button } from "@/components/ui/button"
import { useI18n } from "@/locales/client"

export function ActionsPanel() {
  const t = useI18n()
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 justify-between">
      <div className="flex gap-2">
        <Button variant="default">{t("buyAsset")}</Button>
        <Button variant="secondary">{t("sellAsset")}</Button>
      </div>
    </div>
  )
}
