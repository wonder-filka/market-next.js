'use client'

import Link from "next/link"
import { UserPlus, Wallet, Rocket } from "lucide-react"

export function FinalCtaBlock() {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <div className="bg-gradient-to-r bg-black/80 rounded-3xl shadow-xl p-10 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5">
          Готовы присоединиться к ведущему брокеру?
        </h2>
        <p className="text-lg text-blue-100 mb-8">
          Присоединяйтесь к нашему сообществу трейдеров по всему миру и начните зарабатывать уже сегодня.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
          <div className="flex flex-col items-center gap-2">
            <UserPlus className="w-10 h-10 text-blue-400 mb-1" />
            <span className="text-white font-semibold text-lg">1. Создайте аккаунт</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Wallet className="w-10 h-10 text-green-300 mb-1" />
            <span className="text-white font-semibold text-lg">2. Внесите первый депозит</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Rocket className="w-10 h-10 text-red-300 mb-1" />
            <span className="text-white font-semibold text-lg">3. Начните торговать</span>
          </div>
        </div>
        <Link
          href="/registration"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-10 py-4 text-lg shadow-lg transition"
        >
          Присоединиться сейчас
        </Link>
      </div>
    </section>
  )
}
