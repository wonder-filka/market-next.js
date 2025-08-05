'use client'

import { useI18n } from "@/locales/client"
import { ShieldCheck, Globe, Star } from "lucide-react"

export function TrustStatsBlock() {
  const t = useI18n()

  const stats = [
    { icon: <Star className="text-yellow-300 w-8 h-8" />, value: "4.9/5", label: t("aboutBlock.stats.rating") },
    { icon: <Globe className="text-green-400 w-8 h-8" />, value: "50+", label: t("aboutBlock.stats.countries") },
    { icon: <ShieldCheck className="text-blue-500 w-8 h-8" />, value: "99.99%", label: t("aboutBlock.stats.uptime") },
  ]

  return (
    <section className="py-10 px-4 max-w-5xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
        {t("aboutBlock.stats.title")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="bg-black/70 p-6 rounded-2xl shadow flex flex-col items-center"
          >
            <div className="mb-2">{s.icon}</div>
            <div className="text-white text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-gray-400">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
