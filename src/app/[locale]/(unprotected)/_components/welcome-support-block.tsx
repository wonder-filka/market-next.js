'use client'

import Link from "next/link"
import { Gift, CheckCircle2 } from "lucide-react"

export function WelcomeSupportBlock() {
  return (
    <section className=" px-4 max-w-6xl mx-auto overflow-hidden ">
      <div className="bg-gradient-to-br  rounded-3xl shadow-xl p-10 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 flex flex-col items-center md:items-start">
          <div className="flex items-center gap-3 mb-3">
            <Gift className="text-green-400" size={32} />
            <span className="text-lg  text-green-400 font-semibold">Подарок новым клиентам</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            2 недели личного сопровождения бесплатно
          </h2>
          <p className="text-lg text-blue-100 mb-4 max-w-xl">
            Только после регистрации — получите персонального помощника, который будет сопровождать вас по всем сделкам в течение первых двух недель.<br />
            Помощь с платформой, индивидуальные подсказки, рекомендации по сделкам и поддержка по любым вопросам — всё включено в подарок для новых трейдеров!
          </p>
          <ul className="space-y-2 text-blue-200 mb-6">
            <li className="flex items-center gap-2"><CheckCircle2 className="text-green-400" size={18} /> Персональный трейдер-консультант</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="text-green-400" size={18} /> Помощь по всем вашим сделкам</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="text-green-400" size={18} /> Сопровождение 24/7</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="text-green-400" size={18} /> В любой момент можно отказаться или продлить</li>
          </ul>
          <Link
            href="/registration"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-4 text-xl font-semibold transition"
          >
            Получить сопровождение бесплатно
          </Link>
        </div>
        <div className=" flex justify-center md:justify-end">
          {/* Можно заменить на свою иконку или иллюстрацию */}
          <Gift className="w-40 h-40 text-blue-400 drop-shadow-lg" />
        </div>
      </div>
    </section>
  )
}
