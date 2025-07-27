'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const reviews = [
  {
    name: "Алексей, Москва",
    initials: "АМ",
    text: "Очень доволен платформой - быстрое исполнение сделок, удобный интерфейс, понятная аналитика. ",
    experience: "Трейдер с 2-летним опытом"
  },
  {
    name: "Екатерина, Ростов",
    initials: "ЕР",
    text: "Сначала боялась пробовать, но всё оказалось очень просто. Регистрация заняла пару минут, а пополнение прошло без задержек. Теперь контролирую свой портфель прямо с телефона.",
    experience: "Новичок"
  },
  {
    name: "Игорь, Алматы",
    initials: "ИА",
    text: "Торгую на разных рынках. Понравилось, что комиссии нулевые, а вывод денег происходит быстро. Поддержка реально отвечает круглосуточно и на русском языке.",
    experience: "Профессиональный инвестор"
  },
  {
    name: "Ольга, Минск",
    initials: "ОМ",
    text: "Очень удобная и интуитивная платформа. Даже если возникают вопросы, саппорт всегда на связи. Рекомендую и новичкам, и тем, кто уже давно на рынке.",
    experience: "Трейдер-любитель"
  }
]

export function ReviewsBlock() {
  return (
    <section className="py-14 px-4 max-w-5xl mx-auto overflow-hidden">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-5">
        Что говорят наши пользователи?
      </h2>
      <p className="text-center text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
        Ознакомьтесь с отзывами наших клиентов — как новичков, так и опытных трейдеров, чтобы узнать, почему нам доверяют по всему миру.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reviews.map((review, idx) => (
          <div
            key={idx}
            className="bg-black/80 rounded-2xl shadow p-6 flex flex-col items-center text-center transition hover:shadow-lg hover:-translate-y-1"
          >
            <Avatar className="mb-3 w-16 h-16">
              <AvatarFallback className="bg-blue-700 text-white text-xl">{review.initials}</AvatarFallback>
            </Avatar>
            <div className="text-white text-lg font-semibold mb-1">{review.name}</div>
            <div className="text-xs text-blue-300 mb-2">{review.experience}</div>
            <p className="text-gray-200 text-sm">{review.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
