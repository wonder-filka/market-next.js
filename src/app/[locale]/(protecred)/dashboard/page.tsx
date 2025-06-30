import { getI18n } from "@/locales/server";
import { CategoryPanel } from "./_components/category-panel";
import { QuoteChartPanel } from "./_components/quote-chart-panel";
import { TopGainers } from "./_components/tables/top-gainers";
import { TopLosers } from "./_components/tables/top-losers";
import { VolatileTable } from "./_components/tables/volatile-table";
import { getQuotes } from "./_actions";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/db";


export default async function DashboardPage() {
  const userId = await getSessionUserId()
    if (!userId) {
      return null
    }
  
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        wallet: true,
        accounts: true,
      },
    })
  
    if (!user) {
      return null
    }

  const t = await getI18n()

  const quotes = await getQuotes()
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">{t("dashboardGreeting")}, {user.firstName}</h1>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="space-y-6 col-span-2">

          <VolatileTable initialQuotes={quotes} />
          <TopGainers initialQuotes={quotes} />
          <TopLosers initialQuotes={quotes} />
        </div>

        <div className="space-y-6 col-span-3">
          <QuoteChartPanel accounts={user.accounts} userId={userId}/>

          <CategoryPanel initialQuotes={quotes} />



        </div>
      </div>
    </main>
  )
}
