'use client'

import Link from "next/link"
import { Mail, Phone, Globe } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-black/90 border-t border-white/10 pt-10 pb-6 px-4 text-gray-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 justify-between">
        {/* Лого и слоган */}
        <div className="mb-6 md:mb-0 flex-1 min-w-[180px]">
          <Link href="/" className="text-2xl font-bold text-white tracking-wide">
            2TradeIn<span className="text-blue-400">.</span>
          </Link>
          <p className="mt-2 text-sm text-gray-400">Лучший брокер для СНГ и Восточной Европы</p>
        </div>

        {/* Быстрые ссылки */}
        <div className="flex-1 min-w-[160px]">
          <h4 className="text-lg font-semibold text-white mb-3">Навигация</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/registration" className="hover:text-blue-400">Регистрация</Link></li>
            <li><Link href="/login" className="hover:text-blue-400">Вход</Link></li>
            <li><Link href="/about" className="hover:text-blue-400">О платформе</Link></li>
            <li><Link href="/contacts" className="hover:text-blue-400">Контакты</Link></li>
            <li><Link href="/faq" className="hover:text-blue-400">FAQ</Link></li>
          </ul>
        </div>

        {/* Контакты */}
        <div className="flex-1 min-w-[180px]">
          <h4 className="text-lg font-semibold text-white mb-3">Контакты</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Mail size={16} /> support@finmarket.com</li>
            <li className="flex items-center gap-2"><Phone size={16} /> +44 123 456 789</li>
            <li className="flex items-center gap-2"><Globe size={16} /> finmarket.com</li>
          </ul>
        </div>

        {/* Соцсети */}
        {/* <div className="flex-1 min-w-[180px]">
          <h4 className="text-lg font-semibold text-white mb-3">Мы в соцсетях</h4>
          <div className="flex gap-5 mt-2">
            <a href="https://t.me/finmarket" target="_blank" rel="noopener" aria-label="Telegram">
              <Telegram size={24} className="hover:text-blue-400" />
            </a>
            <a href="https://instagram.com/finmarket" target="_blank" rel="noopener" aria-label="Instagram">
              <Instagram size={24} className="hover:text-pink-400" />
            </a>
            <a href="https://youtube.com/finmarket" target="_blank" rel="noopener" aria-label="Youtube">
              <Youtube size={24} className="hover:text-red-500" />
            </a>
          </div>
        </div> */}
      </div>

      {/* Линия и копирайт */}
      <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} FinMarket. Все права защищены.
      </div>
    </footer>
  )
}
