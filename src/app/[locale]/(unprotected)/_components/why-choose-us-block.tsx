'use client'

import Image from "next/image"
import Link from "next/link"

const features = [
  {
    title: "Интуитивно понятная платформа для всех",
    img: "/11.png",
    description: "Платформа подойдет и опытным трейдерам, и тем, кто только начинает путь на финансовых рынках. Просто, наглядно и никаких лишних сложностей.",
    cta: "Узнать больше"
  },
  {
    title: "Регистрация за 2 минуты",
    img: "/22.png",
    description: "Создай аккаунт за считанные минуты и сразу начни торговать. Минимум документов, максимум удобства — без бюрократии и ожиданий.",
    cta: "Узнать больше"
  },
  {
    title: "Поддержка 24/7 на русском и английском",
    img: "/call.png",
    description: "Профессиональная поддержка на родном языке. Наши эксперты помогут с любым вопросом — днем и ночью, без выходных.",
    cta: "Узнать больше"
  },
  {
    title: "Торгуй с телефона — всегда и везде",
    img: "/44.png", 
    description: "Открывай сделки, отслеживай рынок и управляй портфелем прямо с мобильного телефона. Полный контроль над инвестициями — в твоём кармане, в любое время.",
    cta: "Узнать больше"
  },
  {
    title: "0% комиссии на сделки",
    img: "/66.png",
    description: "Торгуй без лишних затрат. Нет скрытых комиссий — прозрачные условия для всех пользователей. Пополняй счет и выводи средства без дополнительных расходов.",
    cta: "Узнать больше"
  },
  {
    title: "Мгновенный ввод и вывод средств",
    img: "/77.png",
    description: "Пополнение и вывод на карту или крипто-кошелек — за минуты. Управляй своими средствами быстро и удобно.",
    cta: "Узнать больше"
  },
]

export function WhyChooseUsBlock() {
  return (
    <section className="py-14 px-4 max-w-6xl mx-auto overflow-hidden ">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-10">
        Почему выбирают нашу платформу?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {features.map((f, idx) => (
          <div
            key={idx}
            className="bg-black/80 rounded-2xl shadow p-6 flex flex-col items-center text-center transition hover:shadow-lg hover:-translate-y-1"
          >
            {/* Картинка/иконка — замени src на свой путь */}
            <div className="mb-4 flex justify-center items-center">
              <Image src={f.img} alt={f.title} width={300} height={100} className="rounded-xl" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-3 text-white">{f.title}</h3>
            <p className="text-sm text-gray-300 mb-4">{f.description}</p>
            <Link href="registration" className="text-blue-500 font-medium text-sm cursor-pointer hover:underline">{f.cta}</Link>
          </div>
        ))}
      </div>
    </section>
  )
}
