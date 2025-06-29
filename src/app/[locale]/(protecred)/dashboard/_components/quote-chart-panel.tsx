'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useQuoteStore } from '@/stores/chart-store'
import * as React from 'react'
import { useI18n } from '@/locales/client'

const Candlestick = (props: any) => {
  const {
    x,
    y,
    width,
    height,
    low,
    high,
    openClose: [open, close],
  } = props

  const isGrowing = open < close
  const color = isGrowing ? 'green' : 'red'
  const bodyHeight = Math.abs(open - close)
  const ratio = height / bodyHeight || 1

  const yOpen = y + (isGrowing ? (high - open) * ratio : (high - close) * ratio)
  const yClose = y + (isGrowing ? (high - close) * ratio : (high - open) * ratio)
  const yHigh = y
  const yLow = y + (high - low) * ratio

  return (
    <g stroke={color} fill="none" strokeWidth={2}>
      <line x1={x + width / 2} x2={x + width / 2} y1={yHigh} y2={yLow} />
      <rect
        x={x}
        y={Math.min(yOpen, yClose)}
        width={width}
        height={Math.max(Math.abs(yOpen - yClose), 1)}
        fill={color}
      />
    </g>
  )
}

const prepareCandlestickData = (history: { time: string; price: number }[]) => {
  return history.map((d, i) => {
    const open = i === 0 ? d.price : history[i - 1].price
    const close = d.price
    const high = Math.max(open, close) + Math.random() * 2
    const low = Math.min(open, close) - Math.random() * 2
    return {
      ...d,
      openClose: [open, close],
    }
  })
}

export function QuoteChartPanel() {
  const t = useI18n()
  const selectedQuote = useQuoteStore((state) => state.selectedQuote)
  if (!selectedQuote) return null

  const data = prepareCandlestickData(selectedQuote.history)

  const min = Math.min(...data.map(d => Math.min(d.low, d.openClose[0], d.openClose[1])))
  const max = Math.max(...data.map(d => Math.max(d.high, d.openClose[0], d.openClose[1])))

  const locale = t("locale") // ← your locale string like 'ru-RU' or 'en-US'

  return (
    <div className="w-full rounded-lg border p-4 shadow-sm bg-background">
      <h2 className="text-lg font-semibold mb-2">{selectedQuote.name}</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
          >
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => {
                const date = new Date(`2024-${value}`)
                return date.toLocaleDateString(locale, { day: '2-digit', month: 'short' })
              }}
            />
            <YAxis
              domain={[min, max]}
              tick={{ fontSize: 10 }}

              width={60}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip
              content={({ payload }) => {
                if (!payload?.[0]) return null
                const item = payload[0].payload
                return (
                  <div className="p-2 bg-white border shadow-sm text-sm text-black">
                    <div>{t("open")}: {item.openClose[0]}</div>
                    <div>{t("close")}: {item.openClose[1]}</div>
                  
                  </div>
                )
              }}
            />
            <Bar dataKey="openClose" shape={<Candlestick />} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
