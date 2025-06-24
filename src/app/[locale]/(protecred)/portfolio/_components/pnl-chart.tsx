'use client'

import { Card } from "@/components/ui/card"
import { useI18n } from "@/locales/client"

export function PnLChart() {
  const t = useI18n()
  return (
    <Card className="w-full h-40 flex items-center justify-center bg-muted/50 dark:bg-neutral-800">
      <span className="text-muted-foreground text-sm">{t("pnlChartPlaceholder")}</span>
    </Card>
  )
}
