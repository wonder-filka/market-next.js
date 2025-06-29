import { getI18n } from "@/locales/server";
import { CategoryPanel } from "./_components/category-panel";
import { QuoteChartPanel } from "./_components/quote-chart-panel";
import { TopGainers } from "./_components/tables/top-gainers";
import { TopLosers } from "./_components/tables/top-losers";
import { VolatileTable } from "./_components/tables/volatile-table";
import { getQuotes } from "./_actions";


export default async function DashboardPage() {
  const t = await getI18n()
  const name = 'Lena'

  const quotes = await getQuotes()
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">{t("dashboardGreeting")}, {name}</h1>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="space-y-6 col-span-2">

          <VolatileTable initialQuotes={quotes} />
          <TopGainers initialQuotes={quotes} />
          <TopLosers initialQuotes={quotes} />
        </div>

        <div className="space-y-6 col-span-3">
          <QuoteChartPanel />

          <CategoryPanel initialQuotes={quotes} />



        </div>
      </div>
    </main>
  )
}
