'use client'

import { useI18n } from "@/locales/client"
import { HeartHandshake, ShieldCheck, Zap } from "lucide-react"

export function CompanyValuesBlock() {
  const t = useI18n()

  const values = [
    {
      icon: <HeartHandshake className="text-green-400 w-10 h-10" />,
      title: t("aboutBlock.values.innovation.title"),
      desc: t("aboutBlock.values.innovation.desc"),
    },
    {
      icon: <ShieldCheck className="text-blue-400 w-10 h-10" />,
      title: t("aboutBlock.values.security.title"),
      desc: t("aboutBlock.values.security.desc"),
    },
    {
      icon: <Zap className="text-yellow-400 w-10 h-10" />,
      title: t("aboutBlock.values.speed.title"),
      desc: t("aboutBlock.values.speed.desc"),
    },
  ]

  return (
    <section className="py-10 px-4 max-w-6xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
        {t("aboutBlock.values.title")}
      </h2>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {values.map((v, i) => (
          <div
            key={i}
            className="bg-white/5 p-6 rounded-2xl shadow text-center hover:-translate-y-1 transition"
          >
            <div className="flex justify-center mb-4">{v.icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{v.title}</h3>
            <p className="text-sm text-gray-300">{v.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
