import { getI18n } from "@/locales/server";
import { CategoryPanel } from "./_components/category-panel";
import { QuoteChartPanel } from "./_components/quote-chart-panel";
import { TopGainers } from "./_components/tables/top-gainers";
import { TopLosers } from "./_components/tables/top-losers";
import { VolatileTable } from "./_components/tables/volatile-table";
import { getSessionUserId } from "@/lib/session";
import { getRates } from "@/lib/rates";
import { getUser } from "../accounts/_actions";
import { getUserAssets } from "../_actions";


export default async function DashboardPage() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const user = await getUser(userId);
  if (!user) return null;


  const t = await getI18n()
  const rates = await getRates([...new Set(user.accounts.map(a => a.currency))]);
  const safeRates: Record<string, number> = Object.fromEntries(
    Object.entries(rates)
      .filter(([_, v]) => typeof v === "number" && !isNaN(v))
      .map(([k, v]) => [k, v as number])
  );

  const userAssets = await getUserAssets(userId);
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">{t("dashboardGreeting")}, {user.firstName}</h1>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="space-y-6 col-span-1 xl:col-span-2">
          <VolatileTable userAssets={userAssets}/>
        </div>
        <div className="space-y-6 col-span-1 xl:col-span-3">
          <QuoteChartPanel accounts={user.accounts} userId={userId} rates={safeRates} />
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="space-y-6 col-span-1 xl:col-span-2">
          <TopGainers  />
          <TopLosers  />
        </div>
        <div className="space-y-6 col-span-1 xl:col-span-3">
          <CategoryPanel  />
        </div>
      </div>
    </main>
  )
}
