import { create } from 'zustand'

export type QuoteHistoryPoint = {
  time: string
  price: number
}

export type QuoteData = {
  name: string
  symbol: string
  price: number
  change: number
  sell: number
  buy: number
  history: QuoteHistoryPoint[]
}

type QuoteStore = {
  selectedQuote: QuoteData | null
  setSelectedQuote: (quote: QuoteData | null) => void
}

export const useQuoteStore = create<QuoteStore>((set) => ({
  selectedQuote: null,
  setSelectedQuote: (quote) => set({ selectedQuote: quote }),
}))
