'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useI18n } from "@/locales/client"
import Link from "next/link"
import { GraduationCap, BookOpen, HelpCircle, UserCheck, TrendingUp } from "lucide-react"

const sectionIcons = [
  <GraduationCap key={0} size={32} className="text-blue-400 drop-shadow" />,
  <BookOpen key={1} size={32} className="text-green-400 drop-shadow" />,
  <HelpCircle key={2} size={32} className="text-purple-400 drop-shadow" />,
  <UserCheck key={3} size={32} className="text-orange-400 drop-shadow" />,
  <TrendingUp key={4} size={32} className="text-red-400 drop-shadow" />,
];

export default function EducationPage() {
  const t = useI18n()
  const sectionCount = 5
  const sections = Array.from({ length: sectionCount }).map((_, i) => ({
    title: t(`educationBlock.sections.${i}.title` as keyof typeof t),
    desc: t(`educationBlock.sections.${i}.desc` as keyof typeof t),
  })).filter(s => s.title && s.desc)

  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center  drop-shadow-sm">
        {t("educationBlock.title")}
      </h1>
      <p className="text-lg md:text-xl text-blue-100 mb-12 text-center max-w-2xl mx-auto">
        {t("educationBlock.intro")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, idx) => (
          <Card
            key={idx}
            className="rounded-2xl shadow-lg bg-gradient-to-br from-[#191f2a] to-[#15171b] border-0 transition transform hover:-translate-y-1 "
          >
            <CardHeader className="flex items-center gap-4 pb-0">
              <div>
                {sectionIcons[idx] || <GraduationCap size={32} className="text-blue-400" />}
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-1 text-blue-100">{section.title}</h2>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-blue-200 text-base">{section.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-center mt-12">
        <Link
          href="/registration"
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-semibold shadow-lg text-lg transition flex items-center gap-2"
        >
          {t("educationBlock.cta")}
        </Link>
      </div>
    </main>
  )
}
