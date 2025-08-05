'use client'

import { useI18n } from "@/locales/client"
import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

export default function FAQPage() {
	const t = useI18n()
	const faqCount = 6

	const faqList = Array.from({ length: faqCount }).map((_, i) => ({
		q: t(`faqList.${i}.q` as keyof typeof t),
		a: t(`faqList.${i}.a` as keyof typeof t),
	})).filter(f => f.q && f.a)

	const [openIndex, setOpenIndex] = useState<number | null>(null)

	const refs = useRef<(HTMLDivElement | null)[]>([])

	useEffect(() => {
		refs.current.forEach((el, idx) => {
			if (!el) return
			if (idx === openIndex) {
				el.style.maxHeight = el.scrollHeight + "px"
			} else {
				el.style.maxHeight = "0px"
			}
		})
	}, [openIndex])

	return (
		<main className="max-w-4xl mx-auto py-16 px-4">
			<h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-white">
				{t("faqTitle")}
			</h1>

			<div className="space-y-4">
				{faqList.map((faq, idx) => {
					const isOpen = openIndex === idx
					return (
						<div
							key={idx}
							className={`bg-black/80 rounded-2xl shadow-lg border border-white/10 overflow-hidden transition-colors duration-300`}
						>
							<button
								onClick={() => setOpenIndex(isOpen ? null : idx)}
								className="w-full flex items-center justify-between px-6 py-5 text-left text-lg md:text-xl font-semibold text-green-400 hover:text-green-300 transition-colors"
							>
								<span className="pr-4">{faq.q}</span>
								<ChevronDown
									className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""
										}`}
								/>
							</button>

							<div
								ref={(el) => {
									refs.current[idx] = el
								}}
								className="px-6 overflow-hidden transition-all duration-500 ease-in-out max-h-0"
							>
								<div className="pb-6 pt-1 text-base text-gray-300">
									{faq.a}
								</div>
							</div>
						</div>
					)
				})}
			</div>
		</main>
	)
}
