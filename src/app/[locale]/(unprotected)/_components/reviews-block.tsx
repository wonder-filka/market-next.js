'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useI18n } from "@/locales/client"

const reviews = [
  {
    key: "aleksei",
    initials: "АМ",
  },
  {
    key: "ekaterina",
    initials: "ЕР",
  },
  {
    key: "igor",
    initials: "ИА",
  },
  {
    key: "olga",
    initials: "ОМ",
  }
]

export function ReviewsBlock() {
  const t = useI18n()
  return (
    <section className="py-14 px-4 max-w-5xl mx-auto overflow-hidden">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-5">
        {t("reviewsBlock.title")}
      </h2>
      <p className="text-center text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
        {t("reviewsBlock.subtitle")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reviews.map((review) => (
          <div
            key={review.key}
            className="bg-black/80 rounded-2xl shadow p-6 flex flex-col items-center text-center transition hover:shadow-lg hover:-translate-y-1"
          >
            <Avatar className="mb-3 w-16 h-16">
              <AvatarFallback className="bg-blue-700 text-white text-xl">{review.initials}</AvatarFallback>
            </Avatar>
            <div className="text-white text-lg font-semibold mb-1">{t(`reviewsBlock.${review.key}.name`)}</div>
            <div className="text-xs text-blue-300 mb-2">{t(`reviewsBlock.${review.key}.experience`)}</div>
            <p className="text-gray-200 text-sm">{t(`reviewsBlock.${review.key}.text`)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
