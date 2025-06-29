import { ActionsPanel } from "./_components/actions-panel";
import { PnLChart } from "./_components/pnl-chart";
import { PositionsTable } from "./_components/positions-table";
import { SummaryCards } from "./_components/summary-cards";


const accountSummary = {
  balance: 18750.5,
  openPositions: 4,
};

const positions = [
  { id: "1", date: "2024-06-01", asset: "BTC", type: "Buy", quantity: 0.5, entry: 40000, current: 42000, pnl: 1000, status: "Active" },
  { id: "2", date: "2024-05-20", asset: "ETH", type: "Buy", quantity: 5, entry: 3000, current: 2900, pnl: -500, status: "Active" },
  { id: "3", date: "2024-04-15", asset: "SOL", type: "Sell", quantity: 20, entry: 150, current: 140, pnl: 200, status: "Closed" },
  { id: "4", date: "2024-03-10", asset: "ADA", type: "Buy", quantity: 1000, entry: 1.2, current: 0.8, pnl: -400, status: "Liquidated" },
  { id: "5", date: "2024-02-28", asset: "BNB", type: "Buy", quantity: 10, entry: 350, current: 370, pnl: 200, status: "Closed" },
  { id: "6", date: "2024-01-15", asset: "DOGE", type: "Sell", quantity: 5000, entry: 0.08, current: 0.09, pnl: -50, status: "Closed" },
  { id: "7", date: "2023-12-10", asset: "XRP", type: "Buy", quantity: 2000, entry: 0.5, current: 0.7, pnl: 400, status: "Active" }
];

export default function PortfolioPage() {
    const profit = positions.filter(p => p.pnl > 0).reduce((sum, p) => sum + p.pnl, 0)
  const loss = positions.filter(p => p.pnl < 0).reduce((sum, p) => sum + Math.abs(p.pnl), 0)


  return (
    <div className="p-8 flex flex-col gap-8">
      <SummaryCards  balance={accountSummary.balance}
        openPositions={accountSummary.openPositions}
        profit={profit}
        loss={loss} />
      {/* <PnLChart /> */}
      <ActionsPanel />
      <PositionsTable positions={positions} />
    </div>
  );
}