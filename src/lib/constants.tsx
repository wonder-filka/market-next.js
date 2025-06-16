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
    url: "/quotes",
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