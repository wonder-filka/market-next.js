'use client'

import { useI18n } from "@/locales/client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function TeamBlock() {
  const t = useI18n()

  const team = [
    { name: "Anna Petrova", role: t("aboutBlock.team.ceo"), initials: "АП" },
    { name: "Dmitry Ivanov", role: t("aboutBlock.team.cto"), initials: "ДИ" },
    { name: "Elena Kuznetsova", role: t("aboutBlock.team.support"), initials: "ЕК" },
  ]

  return (
    <section className="py-10 px-4 max-w-5xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
        {t("aboutBlock.team.title")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {team.map((member, idx) => (
          <div
            key={idx}
            className="bg-white/5 p-6 rounded-2xl shadow hover:-translate-y-1 transition flex flex-col items-center"
          >
            <Avatar className="w-16 h-16 mb-4">
              <AvatarFallback className="bg-blue-600 text-white text-xl">{member.initials}</AvatarFallback>
            </Avatar>
            <h3 className="text-white font-semibold text-lg">{member.name}</h3>
            <p className="text-sm text-gray-300">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
