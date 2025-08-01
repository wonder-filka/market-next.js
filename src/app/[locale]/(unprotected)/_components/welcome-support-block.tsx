'use client'

import Link from "next/link"
import { Gift, CheckCircle2 } from "lucide-react"
import { useI18n } from "@/locales/client"

export function WelcomeSupportBlock() {
  const t = useI18n()
  return (
    <section className=" px-4 max-w-6xl mx-auto overflow-hidden ">
      <div className="bg-gradient-to-br  rounded-3xl shadow-xl p-10 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 flex flex-col items-center md:items-start">
          <div className="flex items-center gap-3 mb-3">
            <Gift className="text-green-400" size={32} />
            <span className="text-lg  text-green-400 font-semibold">
              {t("welcomeSupportBlock.gift")}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("welcomeSupportBlock.title")}
          </h2>
          <p className="text-lg text-blue-100 mb-4 max-w-xl">
            {t("welcomeSupportBlock.description")}
          </p>
          <ul className="space-y-2 text-blue-200 mb-6">
            <li className="flex items-center gap-2"><CheckCircle2 className="text-green-400" size={18} />{t("welcomeSupportBlock.item1")}</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="text-green-400" size={18} />{t("welcomeSupportBlock.item2")}</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="text-green-400" size={18} />{t("welcomeSupportBlock.item3")}</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="text-green-400" size={18} />{t("welcomeSupportBlock.item4")}</li>
          </ul>
          <Link
            href="/registration"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-4 text-xl font-semibold transition"
          >
            {t("welcomeSupportBlock.cta")}
          </Link>
        </div>
        <div className=" flex justify-center md:justify-end">
          <Gift className="w-40 h-40 text-blue-400 drop-shadow-lg" />
        </div>
      </div>
    </section>
  )
}
