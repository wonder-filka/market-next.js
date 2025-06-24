import { getI18n } from "@/locales/server";
import { CategoryPanel } from "./_components/category-panel";
import { QuoteChartPanel } from "./_components/quote-chart-panel";
import { TopGainers } from "./_components/tables/top-gainers";
import { TopLosers } from "./_components/tables/top-losers";
import { VolatileTable } from "./_components/tables/volatile-table";

export default async function DashboardPage() {
  const t = await getI18n()
  const name = 'Lena'
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">{t("dashboardGreeting")}, {name}</h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-6">
          <CategoryPanel />
          <VolatileTable />
        </div>

        <div className="space-y-6">
          <TopGainers/>
          <TopLosers />
          <QuoteChartPanel />
        </div>
      </div>
    </main>
  )
}
