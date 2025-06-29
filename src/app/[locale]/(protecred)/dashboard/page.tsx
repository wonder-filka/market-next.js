import { getI18n } from "@/locales/server";
import { CategoryPanel } from "./_components/category-panel";
import { QuoteChartPanel } from "./_components/quote-chart-panel";
import { TopGainers } from "./_components/tables/top-gainers";
import { TopLosers } from "./_components/tables/top-losers";
import { VolatileTable } from "./_components/tables/volatile-table";
import yahooFinance from 'yahoo-finance2'
import { getQuotes } from "./_actions";

const symbols = [
  '^NDX',        // NASDAQ 100
  '^GSPC',       // S&P 500
  '^DJI',        // Dow Jones 30
  'BTC-USD',     // Bitcoin
  'ETH-USD',     // Ethereum
  'GC=F',        // Gold Futures
  'CL=F',        // Crude Oil Futures
  'COMT',        // iShares Commodity Optimized Trust (ETF — широкий индекс по товарам)
]

export default async function DashboardPage() {
  const t = await getI18n()
  const name = 'Lena'

  const quotes = await getQuotes()
  console.log(quotes)
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">{t("dashboardGreeting")}, {name}</h1>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="space-y-6 col-span-2">

          <VolatileTable initialQuotes={quotes}/>
          <TopGainers initialQuotes={quotes} />
       <TopLosers  initialQuotes={quotes}/>
        </div>

        <div className="space-y-6 col-span-3">
          <QuoteChartPanel />
             
          <CategoryPanel  initialQuotes={quotes} />



        </div>
      </div>
    </main>
  )
}
