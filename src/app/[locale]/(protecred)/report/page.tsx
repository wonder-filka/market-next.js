import { SummaryCard } from "./_components/summary-card";
import { formatCurrency } from "@/lib/helpers";
import { TradesList } from "./_components/trades-list";
import { Trade } from "@/lib/types";

const fakeSummary = {
  totalTrades: 42,
  totalVolume: 125000,
  accountBalance: 18750.5,
};

const fakeTrades: Trade[] = [
  {
    id: "TRD-001",
    date: "2024-06-01 10:15",
    asset: "BTC",
    type: "Buy",
    quantity: 0.5,
    price: 65000,
    total: 32500,
    status: "Completed",
  },
  {
    id: "TRD-002",
    date: "2024-06-02 14:30",
    asset: "ETH",
    type: "Sell",
    quantity: 10,
    price: 3500,
    total: 35000,
    status: "Completed",
  },
  {
    id: "TRD-003",
    date: "2024-06-03 09:20",
    asset: "SOL",
    type: "Buy",
    quantity: 100,
    price: 150,
    total: 15000,
    status: "Pending",
  },
  {
    id: "TRD-004",
    date: "2024-06-04 16:45",
    asset: "ADA",
    type: "Sell",
    quantity: 2000,
    price: 0.45,
    total: 900,
    status: "Cancelled",
  },
  {
    id: "TRD-005",
    date: "2024-06-05 11:10",
    asset: "BTC",
    type: "Buy",
    quantity: 0.2,
    price: 67000,
    total: 13400,
    status: "Completed",
  },
];


export default function Page() {
  return (
    <div className="space-y-8 p-8">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SummaryCard label={"totalTrades"} value={fakeSummary.totalTrades} />
        <SummaryCard label={"totalVolume"} value={formatCurrency(fakeSummary.totalVolume)} />
        <SummaryCard label={"accountBalance"} value={formatCurrency(fakeSummary.accountBalance)} />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Recent Trades</h2>
        <TradesList data={fakeTrades} />
      </section>
    </div>
  );
}