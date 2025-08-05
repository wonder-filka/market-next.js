'use client'

import { useI18n } from "@/locales/client"

export function CompanyIntroBlock() {
  const t = useI18n()

  return (
    <section className="py-10 px-4 max-w-5xl mx-auto text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
        {t("aboutBlock.intro.title")}
      </h1>
      <p className="text-lg text-gray-300 max-w-3xl mx-auto">
        {t("aboutBlock.intro.description")}
      </p>
    </section>
  )
}
