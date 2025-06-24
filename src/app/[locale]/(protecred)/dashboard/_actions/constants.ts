import { QuoteData } from "@/lib/types"

export const fakeCategories = [
  { name: "crypto", value: 28 },
  { name: "indices", value: 22 },
  { name: "forex", value: 17 },
  { name: "commodities", value: 15 },
  { name: "stocks", value: 18 },
]

export const popular = {
  "Акции": ["AAPL", "TSLA", "NVDA", "PLTR", "MSFT", "AMZN"]
}

export const fakeQuotes: QuoteData[] = [
  {
    name: "Apple Inc.",
    symbol: "AAPL",
    price: 192.32,
    change: 1.52,
    sell: 192.20,
    buy: 192.40,
    history: [
      { time: "01.06", price: 190 },
      { time: "02.06", price: 191 },
      { time: "03.06", price: 191.5 },
      { time: "04.06", price: 192 },
      { time: "05.06", price: 192.32 },
    ]
  },
  {
    name: "Tesla Inc.",
    symbol: "TSLA",
    price: 832.10,
    change: -0.87,
    sell: 831.50,
    buy: 832.50,
    history: [
      { time: "01.06", price: 845 },
      { time: "02.06", price: 840 },
      { time: "03.06", price: 835 },
      { time: "04.06", price: 834 },
      { time: "05.06", price: 832.10 },
    ]
  },
  {
    name: "NVIDIA Corp.",
    symbol: "NVDA",
    price: 122.00,
    change: 2.35,
    sell: 121.80,
    buy: 122.20,
    history: [
      { time: "01.06", price: 115 },
      { time: "02.06", price: 117 },
      { time: "03.06", price: 120 },
      { time: "04.06", price: 121 },
      { time: "05.06", price: 122.00 },
    ]
  },
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
  },
  {
    name: "Ethereum",
    symbol: "ETHUSDT",
    price: 3250.75,
    change: -0.42,
    sell: 3245.00,
    buy: 3255.00,
    history: [
      { time: "01.06", price: 3300 },
      { time: "02.06", price: 3280 },
      { time: "03.06", price: 3270 },
      { time: "04.06", price: 3260 },
      { time: "05.06", price: 3250.75 },
    ]
  },
  {
    name: "Gold Futures",
    symbol: "GC=F",
    price: 2345.10,
    change: 0.12,
    sell: 2344.80,
    buy: 2345.30,
    history: [
      { time: "01.06", price: 2320 },
      { time: "02.06", price: 2330 },
      { time: "03.06", price: 2340 },
      { time: "04.06", price: 2342 },
      { time: "05.06", price: 2345.10 },
    ]
  },
  {
    name: "Oil Futures",
    symbol: "CL=F",
    price: 81.32,
    change: -0.65,
    sell: 81.20,
    buy: 81.40,
    history: [
      { time: "01.06", price: 83 },
      { time: "02.06", price: 82 },
      { time: "03.06", price: 81.8 },
      { time: "04.06", price: 81.5 },
      { time: "05.06", price: 81.32 },
    ]
  },
  {
    name: "NASDAQ 100",
    symbol: "^NDX",
    price: 19120.45,
    change: 0.33,
    sell: 19118.00,
    buy: 19122.00,
    history: [
      { time: "01.06", price: 18950 },
      { time: "02.06", price: 19000 },
      { time: "03.06", price: 19050 },
      { time: "04.06", price: 19100 },
      { time: "05.06", price: 19120.45 },
    ]
  },
  {
    name: "US 10Y Treasury Note",
    symbol: "TNX",
    price: 4.32,
    change: -0.05,
    sell: 4.30,
    buy: 4.34,
    history: [
      { time: "01.06", price: 4.35 },
      { time: "02.06", price: 4.34 },
      { time: "03.06", price: 4.33 },
      { time: "04.06", price: 4.32 },
      { time: "05.06", price: 4.32 },
    ]
  },
  {
    name: "Amazon.com Inc.",
    symbol: "AMZN",
    price: 135.47,
    change: 1.03,
    sell: 135.20,
    buy: 135.70,
    history: [
      { time: "01.06", price: 132 },
      { time: "02.06", price: 133 },
      { time: "03.06", price: 134 },
      { time: "04.06", price: 135 },
      { time: "05.06", price: 135.47 },
    ]
  }
]
