'use client'

import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/locales/client"

const features = [
  {
    key: "platform",
    img: "/11.png",
  },
  {
    key: "registration",
    img: "/22.png",
  },
  {
    key: "support",
    img: "/call.png",
  },
  {
    key: "mobile",
    img: "/44.png",
  },
  {
    key: "zeroFee",
    img: "/66.png",
  },
  {
    key: "instantWithdraw",
    img: "/77.png",
  },
]

export function WhyChooseUsBlock() {
  const t = useI18n()
  return (
    <section className="py-14 px-4 max-w-6xl mx-auto overflow-hidden ">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-10">
        {t("whyChooseUs.title")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {features.map((f, idx) => (
          <div
            key={f.key}
            className="bg-black/80 rounded-2xl shadow p-6 flex flex-col items-center text-center transition hover:shadow-lg hover:-translate-y-1"
          >
            <div className="mb-4 flex justify-center items-center">
              <Image src={f.img} alt={t(`whyChooseUs.features.${f.key}.title`)} width={300} height={100} className="rounded-xl" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-3 text-white">{t(`whyChooseUs.features.${f.key}.title`)}</h3>
            <p className="text-sm text-gray-300 mb-4">{t(`whyChooseUs.features.${f.key}.description`)}</p>
            <Link href="/registration" className="text-blue-500 font-medium text-sm cursor-pointer hover:underline">{t(`whyChooseUs.features.${f.key}.cta`)}</Link>
          </div>
        ))}
      </div>
    </section>
  )
}
