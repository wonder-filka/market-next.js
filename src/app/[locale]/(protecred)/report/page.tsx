import { SummaryCard } from "./_components/summary-card";
import { formatCurrency } from "@/lib/helpers";
import { PositionsTableReport } from "./_components/trades-list";
import { getI18n } from "@/locales/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/session";
import { getPostitions } from "./_actions";

export default async function Page() {
  const t = await getI18n()
  const userId = await getSessionUserId();
  if (!userId) return null;
 const positions = await getPostitions()
  // 2. Считаем метрики
  const openPositions = positions.filter(p => p.status === "Active").length
  const profit = positions
    .filter(p => p.pnl > 0)
    .reduce((sum, p) => sum + p.pnl, 0)

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { wallet: true },
  })
    if (!user) return null;
  const balance = user?.wallet.balance ?? 0
const freeMargin = user?.wallet.balance - user?.wallet.withdrawn
  return (
    <div className="space-y-8 p-8">
      <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <SummaryCard label={"totalTrades"} value={openPositions} />
        <SummaryCard label={"totalVolume"} value={formatCurrency(profit)} />
        <SummaryCard label={"accountBalance"} value={formatCurrency(balance)} />
        <SummaryCard label={"freeMargin"} value={formatCurrency(freeMargin)} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">{t("recentTrades")}</h2>
        <PositionsTableReport positions={positions} />
      </section>
    </div>
  );
}