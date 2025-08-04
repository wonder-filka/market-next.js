'use client'

import { Button } from "@/components/ui/button"
import { useI18n } from "@/locales/client"
import { useRouter } from "next/navigation"

export const ActionsPanel = () => {
  const t = useI18n()
    const router = useRouter()

  return (
    <Button variant="default" className="max-w-36" onClick={() => router.push('/dashboard')}>{t('trade')}</Button>
  )
}
