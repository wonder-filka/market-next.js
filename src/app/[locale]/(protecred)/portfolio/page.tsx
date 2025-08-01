import { ActionsPanel } from "./_components/actions-panel";
import { PositionsTable } from "./_components/positions-table";
import { SummaryCards } from "./_components/summary-cards";
import { getSessionUserId } from "@/lib/session";
import { getQuotes } from "../dashboard/_actions";
import { TradeType } from "@/generated/prisma";
import { getRates } from "@/lib/rates";
import { getUser } from "../accounts/_actions";
import { getUserOpenPositions } from "./_actions";
import { getUserAssets } from "../_actions";

export default async function PortfolioPage() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const user = await getUser(userId);
  if (!user) return null;

  const positions = await getUserOpenPositions(userId)
  const quotes = await getQuotes();
  const rates = await getRates([...new Set(user.accounts.map(a => a.currency))]);
  const userAssets = await getUserAssets(userId);
  const buyMap = Object.fromEntries(quotes.map((q) => [q.symbol, q.buy]));
  const sellMap = Object.fromEntries(quotes.map((q) => [q.symbol, q.sell]));


  const enriched = positions.map((p) => {
    const sym = p.asset
    const buy = buyMap[sym] ?? 0;
    const sell = sellMap[sym] ?? 0;
    const savedPnl = p.pnl;
    if (savedPnl && savedPnl !== 0) {
      return p;
    }
    const assetMap = new Map(
      userAssets.map(a => [
        a.asset,
        { priceBuy: a.priceBuy, priceSell: a.priceSell }
      ])
    );
    const asset = assetMap.get(p.asset);

    let currentPrice: number;
    if (asset) {
      // Если есть кастомная цена — берем её
      currentPrice = p.type === TradeType.Buy
        ? asset.priceBuy ?? buy   // если priceBuy нет, берем buy из quotes
        : asset.priceSell ?? sell // если priceSell нет, берем sell из quotes
    } else {
      // Иначе берем стандартную цену
      currentPrice = p.type === TradeType.Buy ? buy : sell;
    }

    // Гарантируем что это число
    if (typeof currentPrice !== 'number') {
      currentPrice = p.type === TradeType.Buy ? buy : sell;
    }

    const qty = p.quantity;
    const entry = p.entry;
    const pnl = p.type === TradeType.Buy
      ? (currentPrice - entry) * qty
      : (entry - currentPrice) * qty;

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