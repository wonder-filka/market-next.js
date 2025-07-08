import { prisma } from "@/lib/db";
import { ActionsPanel } from "./_components/actions-panel";
import { PositionsTable } from "./_components/positions-table";
import { SummaryCards } from "./_components/summary-cards";
import { getSessionUserId } from "@/lib/session";
import { getQuotes } from "../dashboard/_actions";
import { nameToSymbol } from "@/lib/constants";
import { TradeType } from "@/generated/prisma";



export default async function PortfolioPage() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { wallet: true },
  });
  if (!user) return null;

  const positions = await prisma.position.findMany({
    where: { userId, status: { not: "Closed" } },
    orderBy: { date: 'desc' },
  })

  const quotes = await getQuotes();
  const priceMap = Object.fromEntries(quotes.map((q) => [q.symbol, q.price]));
  console.log('priceMap', priceMap)
  // 3. Обогащаем позиции, но только если p.pnl из БД == 0 или null
  const enriched = positions.map((p) => {
    const sym = nameToSymbol[p.asset]
    console.log('sym', sym)
    const savedPnl = p.pnl;
    if (savedPnl && savedPnl !== 0) {
      console.log('savedPnl', savedPnl)
      return p;
    }
    // иначе пересчитываем
    const currentPrice = p.current !== 0 ? p.current : priceMap[sym];
    console.log('currentPrice', currentPrice)
    const qty = p.quantity
    const entry = p.entry
    let pnl: number

    if (p.type === TradeType.Buy) {
      pnl = (currentPrice - entry) * qty
    } else {
      pnl = (entry - currentPrice) * qty
    }
    return { ...p, current: currentPrice, pnl: pnl };
  });

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
      <PositionsTable positions={enriched} />
    </div>
  );
}