import { Quote } from '@/lib/types'
import { create } from 'zustand'



type QuoteStore = {
  selectedQuote: Quote | null
  setSelectedQuote: (quote: Quote) => void
}

export const useQuoteStore = create<QuoteStore>((set) => ({
  selectedQuote: null,
  setSelectedQuote: (quote) => set({ selectedQuote: quote }),
}))
