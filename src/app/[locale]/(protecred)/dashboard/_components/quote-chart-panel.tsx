'use client'

import { useQuoteStore } from "@/stores/chart-store"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

export function QuoteChartPanel() {
  const selectedQuote = useQuoteStore((state) => state.selectedQuote)

  if (!selectedQuote) return null

  return (
    <div className="rounded-lg border p-4 shadow-sm bg-background">
      <h2 className="text-lg font-semibold mb-2">{selectedQuote.name}</h2>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={selectedQuote.history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
