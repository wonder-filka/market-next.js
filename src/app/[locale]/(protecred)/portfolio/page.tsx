import { prisma } from "@/lib/db";
import { ActionsPanel } from "./_components/actions-panel";
import { PositionsTable } from "./_components/positions-table";
import { SummaryCards } from "./_components/summary-cards";
import { getSessionUserId } from "@/lib/session";

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

  const openPositions = positions.filter(p => p.status === 'Active').length

  const profit = positions
    .filter(p => p.pnl > 0)
    .reduce((sum, p) => sum + p.pnl, 0)

  const loss = positions
    .filter(p => p.pnl < 0)
    .reduce((sum, p) => sum + Math.abs(p.pnl), 0)

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