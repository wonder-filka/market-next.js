import { Home, BarChart, Wallet, Settings, FileCheck } from "lucide-react"

export const sidebarItems = [
  {
    key: "sidebar.accounts",
    url: "/accounts",
    icon: Wallet,
  },
  {
    key: "sidebar.portfolio",
    url: "/portfolio",
    icon: Home,
  },
  {
    key: "sidebar.quotes",
    url: "/dashboard",
    icon: BarChart,
  },
  {
    key: "sidebar.report",
    url: "/report",
    icon: FileCheck,
  },
  {
    key: "sidebar.settings",
    url: "/settings",
    icon: Settings,
  },

]


export const sidebarItemsAdmin = [
  {
    key: "sidebar.accounts",
    url: "/accounts",
    icon: Wallet,
  },
  {
    key: "sidebar.portfolio",
    url: "/portfolio",
    icon: Home,
  },
  {
    key: "sidebar.quotes",
    url: "/dashboard",
    icon: BarChart,
  },
  {
    key: "sidebar.report",
    url: "/report",
    icon: FileCheck,
  },
  {
    key: "sidebar.settings",
    url: "/settings",
    icon: Settings,
  },
]


export const quoteNames: Record<string, { en: string; ru: string }> = {
  "^NDX": { en: "NASDAQ 100", ru: "NASDAQ 100" },
  "^GSPC": { en: "S&P 500", ru: "S&P 500" },
  "^DJI": { en: "Dow Jones 30", ru: "Dow Jones 30" },
  "BTC-USD": { en: "Bitcoin", ru: "Bitcoin" },
  "ETH-USD": { en: "Ethereum", ru: "Ethereum" },
  "GC=F": { en: "Gold", ru: "Золото" },
  "CL=F": { en: "Oil", ru: "Нефть" },
  "COMT": { en: "Commodities ETF", ru: "Товары ETF" },
}

export const nameToSymbol = Object.entries(quoteNames).reduce<Record<string,string>>((acc, [symbol, {en,ru}]) => {
  acc[en] = symbol
  acc[ru] = symbol
  return acc
}, {})