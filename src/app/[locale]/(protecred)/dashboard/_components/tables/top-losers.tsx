'use client'

import { fakeQuotes } from "../../_actions/constants"

export function TopLosers() {
  const losers = fakeQuotes
    .filter(q => q.change !== null && q.change < -0.01)
    .sort((a, b) => a.change! - b.change!)
    .slice(0, 5)

  return (
    <div className="p-4 border rounded-lg shadow-sm ">
      <h2 className="text-lg font-semibold mb-2">📉 Падающие рынки</h2>
      {losers.length === 0 ? (
        <div className="text-sm text-muted-foreground">Нет данных</div>
      ) : (
        <ul className="space-y-1 text-sm">
          {losers.map((q) => (
            <li key={q.symbol} className="flex justify-between" >
              <span>{q.name}</span>
              <span className="text-red-500 font-medium">
                {q.change?.toFixed(4)}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
