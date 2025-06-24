import { QuoteData } from '@/app/[locale]/(protecred)/dashboard/_actions/types'
import { create } from 'zustand'

export type QuoteHistoryPoint = {
  time: string
  price: number
}

type QuoteStore = {
  selectedQuote: QuoteData | null
  setSelectedQuote: (quote: QuoteData | null) => void
}

export const useQuoteStore = create<QuoteStore>((set) => ({
  selectedQuote: null,
  setSelectedQuote: (quote) => set({ selectedQuote: quote }),
}))
