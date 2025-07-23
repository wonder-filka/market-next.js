import { create } from 'zustand'

type QuoteStoreState = {
  selectedSymbol: string
  setSelectedSymbol: (symbol: string) => void
}

export const useQuoteStore = create<QuoteStoreState>((set) => ({
  selectedSymbol: 'BTC-USD',
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
}))