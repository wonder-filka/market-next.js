'use server'

import { TradeType } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import yahooFinance from "yahoo-finance2";

const symbols = [
	"^NDX",
	"^GSPC",
	"^DJI",
	"BTC-USD",
	"ETH-USD",
	"GC=F",
	"CL=F",
	"COMT",
];

export async function getQuotes() {
	const today = new Date();
	const from = new Date();
	from.setDate(today.getDate() - 30);

	const result = await Promise.all(
		symbols.map(async (symbol) => {
			const history = await yahooFinance.chart(symbol, {
				period1: from.toISOString().split("T")[0],
				period2: today.toISOString().split("T")[0],
				interval: "1d",
			});

			const prices = history.quotes || [];
			const last = prices.at(-1);
			const prev = prices.at(-2);

			return {
				symbol,
				name: symbol,
				price: last?.close ?? 0,
				change: (last?.close ?? 0) - (prev?.close ?? 0),
				buy: last?.close ?? 0,
				sell: last?.close ?? 0,
				history: prices.map((d) => ({
					time: new Date(d.date).toISOString().slice(5, 10),
					open: d.open ?? 0,
					close: d.close ?? 0,
					high: d.high ?? 0,
					low: d.low ?? 0,
					price: d.close ?? 0,
				})),
			};
		})
	);

	return result;
}

type CreateTradeInput = {
  userId: string;
  accountId: string;
  asset: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  takeProfit: number | null;
  stopLoss: number | null;
};

export async function createTrade(input: CreateTradeInput) {
  const {
    userId,
    accountId,
    asset,
    type,
    quantity,
    price,
    takeProfit,
    stopLoss,
  } = input;

  const total = price * quantity;

  const account = await prisma.account.findUnique({
    where: { id: accountId },
  });

  if (!account) throw new Error("accountNotFound");
  if (account.userId !== userId) throw new Error("unauthorized");

  if (type === "buy" && account.freeMargin < total) {
    throw new Error("insufficientFunds");
  }

  const formattedType = type === "buy" ? "Buy" : "Sell" as TradeType;

  await prisma.trade.create({
    data: {
      asset,
      type: formattedType,
      quantity,
      price,
      total,
      status: "Pending",
      startDate: new Date(),
      endDate: new Date(),
      userId,
      accountId,
      takeProfit, 
      stopLoss,   
    },
  });
}
