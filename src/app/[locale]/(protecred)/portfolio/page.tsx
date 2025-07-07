import { prisma } from "@/lib/db";
import { ActionsPanel } from "./_components/actions-panel";
import { PositionsTable } from "./_components/positions-table";
import { SummaryCards } from "./_components/summary-cards";
import { getSessionUserId } from "@/lib/session";
import { getQuotes } from "../dashboard/_actions";

export default async function PortfolioPage() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { wallet: true },
  });
  if (!user) return null;

  const positions = await prisma.position.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  })

 const symbols = Array.from(new Set(positions.map((p) => p.asset)));
  const quotes = await getQuotes();
  const priceMap = Object.fromEntries(quotes.map((q) => [q.symbol, q.price]));

  // 3. Обогащаем позиции, но только если p.pnl из БД == 0 или null
  const enriched = positions.map((p) => {
    const savedPnl = p.pnl;
    if (savedPnl && savedPnl !== 0) {
      console.log('savedPnl', savedPnl)
      return p;
    }
    // иначе пересчитываем
    const currentPrice = priceMap[p.asset] ?? p.current;
          console.log('currentPrice', currentPrice)
    const recalculatedPnl = (currentPrice - p.entry) * p.quantity;
            console.log('recalculatedPnl', recalculatedPnl)
    return { ...p, current: currentPrice, pnl: recalculatedPnl };
  });
   console.log('enriched', enriched)
  // 4. Считаем метрики по enriched
  const openPositions = enriched.filter((p) => p.status === "Active").length;
  const profit = enriched.filter((p) => p.pnl > 0).reduce((sum, p) => sum + p.pnl, 0);
  const loss = enriched
    .filter((p) => p.pnl < 0)
    .reduce((sum, p) => sum + Math.abs(p.pnl), 0);

    
  return (
    <div className="p-8 flex flex-col gap-8">
      <SummaryCards balance={user?.wallet.balance}
        openPositions={openPositions}
        profit={profit}
        loss={loss} />
      {/* <PnLChart /> */}
      <ActionsPanel />
      <PositionsTable positions={positions} />
    </div>
  );
}