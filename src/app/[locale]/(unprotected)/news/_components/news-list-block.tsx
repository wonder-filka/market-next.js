'use client'

import { useCurrentLocale, useI18n } from "@/locales/client"
import { useEffect, useState } from "react"

type HackerNewsItem = {
  id: number
  title: string
  url?: string
  time: number
}

export function NewsListBlock() {
  const locale = useCurrentLocale()
  const t = useI18n()
  const [news, setNews] = useState<HackerNewsItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTopNews() {
      try {
        const topIdsRes = await fetch("https://hacker-news.firebaseio.com/v0/newstories.json")
        const ids: number[] = await topIdsRes.json()
        const first10 = ids.slice(0, 10)

        const itemRequests = first10.map(id =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
        )

        const items = await Promise.all(itemRequests)
        console.log(items)
        const formatted: HackerNewsItem[] = items.map(item => ({
          id: item.id,
          title: item.title,
          url: item.url,
          time: item.time,
        }))

        setNews(formatted)
      } catch (e) {
        console.error(e)
        setError("newsLoadFailed")
      }
    }

    fetchTopNews()
  }, [])

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto text-center">
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-10">
        {t("newsBlock.title")}
      </h2>

      {error && <div className="text-red-500 font-medium mb-6">{t(error)}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {news.map((n, i) => (
          <a
            key={i}
            href={n.url || `https://news.ycombinator.com/item?id=${n.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black/80 hover:bg-black/60 transition shadow rounded-2xl p-6 text-left"
          >
            <div className="text-xl font-semibold text-white mb-2">
              {n.title}
            </div>
            <div className="text-sm text-blue-200 mb-4">
              {new Date(n.time * 1000).toLocaleDateString(locale)}
            </div>
            <div className="text-base text-gray-300">
              {n.url?.replace(/^https?:\/\//, "") || "news.ycombinator.com"}
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
