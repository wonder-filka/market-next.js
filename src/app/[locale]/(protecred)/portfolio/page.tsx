import { ActionsPanel } from "./_components/actions-panel";
import { PositionsTable } from "./_components/positions-table";
import { SummaryCards } from "./_components/summary-cards";
import { getSessionUserId } from "@/lib/session";;
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
  const rates = await getRates([...new Set(user.accounts.map(a => a.currency))]);
  const userAssets = await getUserAssets(userId);

  const safeRates: Record<string, number> = Object.fromEntries(
    Object.entries(rates)
      .filter(([_, v]) => typeof v === "number" && !isNaN(v))
      .map(([k, v]) => [k, v as number])
  );
  return (
    <div className="p-8 flex flex-col gap-8">
      <SummaryCards balance={user?.wallet.balance}
        openPositions={positions}
     />
   
      <ActionsPanel />
      <PositionsTable
        positions={positions}
        userId={user.id}
        accounts={user.accounts}
        rates={safeRates}
        userAssets={userAssets}
      />
    </div>
  );
}