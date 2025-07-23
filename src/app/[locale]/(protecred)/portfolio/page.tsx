import { prisma } from "@/lib/db";
import { ActionsPanel } from "./_components/actions-panel";
import { PositionsTable } from "./_components/positions-table";
import { SummaryCards } from "./_components/summary-cards";
import { getSessionUserId } from "@/lib/session";
import { getQuotes } from "../dashboard/_actions";
import { nameToSymbol } from "@/lib/constants";
import { TradeType } from "@/generated/prisma";
import { getRates } from "@/lib/rates";
import { getUser } from "../accounts/_actions";



export default async function PortfolioPage() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const user = await getUser(userId);
  if (!user) return null;


  const positions = await prisma.position.findMany({
    where: { userId, status: { not: "Closed" } },
    orderBy: { date: 'desc' },
  })

  const quotes = await getQuotes();
  const rates = await getRates([...new Set(user.accounts.map(a => a.currency))]);

  const buyMap = Object.fromEntries(quotes.map((q) => [q.symbol, q.buy]));
  const sellMap = Object.fromEntries(quotes.map((q) => [q.symbol, q.sell]));


  const enriched = positions.map((p) => {
    const sym = nameToSymbol[p.asset]
    const buy = buyMap[sym] ?? 0;
    const sell = sellMap[sym] ?? 0;
    const savedPnl = p.pnl;
    if (savedPnl && savedPnl !== 0) {
      return p;
    }
    const currentPrice =
      p.current && p.current !== 0
        ? p.current
        : p.type === TradeType.Buy
          ? buy
          : sell;


    const qty = p.quantity
    const entry = p.entry
    let pnl: number
    if (p.type === TradeType.Buy) {
      pnl = (sell - entry) * qty
    } else {
      pnl = (entry - buy) * qty
    }
    return { ...p, current: currentPrice, pnl: Number(pnl.toFixed(18)) };
  });

  // 4. Считаем метрики по enriched
  const openPositions = enriched.filter((p) => p.status === "Active").length;
  const profit = enriched.filter((p) => p.pnl > 0).reduce((sum, p) => sum + p.pnl, 0);
  const loss = enriched
    .filter((p) => p.pnl < 0)
    .reduce((sum, p) => sum + Math.abs(p.pnl), 0);

  const safeRates: Record<string, number> = Object.fromEntries(
    Object.entries(rates)
      .filter(([_, v]) => typeof v === "number" && !isNaN(v))
      .map(([k, v]) => [k, v as number])
  );
  return (
    <div className="p-8 flex flex-col gap-8">
      <SummaryCards balance={user?.wallet.balance}
        openPositions={openPositions}
        profit={profit}
        loss={loss} />
      {/* <PnLChart /> */}
      <ActionsPanel />
      <PositionsTable positions={enriched} userId={user.id} accounts={user.accounts} rates={safeRates} />
    </div>
  );
}