'use client'

import { useI18n } from "@/locales/client"
import Link from "next/link"
import { MonitorSmartphone, Users2, Headset, ArrowRight } from "lucide-react"

export default function ServicesPage() {
	const t = useI18n()
	return (
		<main className="max-w-4xl mx-auto py-10 px-4">
			<h1 className="text-4xl font-bold mb-8 text-center">{t("servicesBlock.title")}</h1>

			{/* --- Платформа --- */}
			<section className="mb-12">
				<div className="flex items-center gap-3 mb-4">
					<MonitorSmartphone className="text-blue-600" size={32} />
					<h2 className="text-2xl font-semibold">{t("servicesBlock.platformTitle")}</h2>
				</div>
				<p className="text-lg text-gray-700 mb-2">{t("servicesBlock.platformDesc1")}</p>
				<p className="text-lg text-gray-700 mb-2">{t("servicesBlock.platformDesc2")}</p>
				<p className="text-lg text-gray-700">{t("servicesBlock.platformDesc3")}</p>
			</section>

			{/* --- Операторы --- */}
			<section className="mb-12">
				<div className="flex items-center gap-3 mb-4">
					<Users2 className="text-green-600" size={32} />
					<h2 className="text-2xl font-semibold">{t("servicesBlock.operatorsTitle")}</h2>
				</div>
				<p className="text-lg text-gray-700 mb-2">{t("servicesBlock.operatorsDesc1")}</p>
				<ul className="list-disc pl-5 text-gray-700 mb-2 space-y-1">
					<li>{t("servicesBlock.operatorsList.0")}</li>
					<li>{t("servicesBlock.operatorsList.1")}</li>
					<li>{t("servicesBlock.operatorsList.2")}</li>
				</ul>
				<p className="text-lg text-gray-700">{t("servicesBlock.operatorsDesc2")}</p>
			</section>

			{/* --- Поддержка --- */}
			<section className="mb-12">
				<div className="flex items-center gap-3 mb-4">
					<Headset className="text-purple-600" size={32} />
					<h2 className="text-2xl font-semibold">{t("servicesBlock.supportTitle")}</h2>
				</div>
				<p className="text-lg text-gray-700 mb-2">{t("servicesBlock.supportDesc1")}</p>
				<p className="text-lg text-gray-700">{t("servicesBlock.supportDesc2")}</p>
			</section>

			<div className="flex justify-center mt-10">
				<Link
					href="/registration"
					className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow transition flex items-center gap-2"
				>
					{t("servicesBlock.cta")}
					<ArrowRight size={22} />
				</Link>
			</div>
		</main>
	)
}
