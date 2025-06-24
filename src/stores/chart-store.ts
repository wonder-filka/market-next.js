import { QuoteData } from '@/app/[locale]/(protecred)/report/_actions/types'
import { create } from 'zustand'

export type QuoteHistoryPoint = {
  time: string
  price: number
}
const defaultData: QuoteData = 
    {
    name: "Bitcoin",
    symbol: "BTCUSDT",
    price: 68100,
    change: 0.76,
    sell: 68050,
    buy: 68150,
    history: [
      { time: "01.06", price: 67000 },
      { time: "02.06", price: 67300 },
      { time: "03.06", price: 67550 },
      { time: "04.06", price: 67800 },
      { time: "05.06", price: 68100 },
    ]
  }

type QuoteStore = {
  selectedQuote: QuoteData | null
  setSelectedQuote: (quote: QuoteData | null) => void
}

export const useQuoteStore = create<QuoteStore>((set) => ({
  selectedQuote: defaultData,
  setSelectedQuote: (quote) => set({ selectedQuote: quote }),
}))
