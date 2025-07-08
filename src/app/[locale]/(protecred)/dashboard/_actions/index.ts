"use server";

import { TradeType } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
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
	try {
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
	} catch (error) {
		console.log(error)
		return [];
	}
}

type CreateTradeInput = {
	userId: string;
	accountId: string;
	asset: string;
	type: "buy" | "sell";
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

	const totalUSD = price * quantity; // считаем в валюте счёта
	const isBuy = type === "buy";
	const tradeType: TradeType = isBuy ? "Buy" : "Sell";

	await prisma.$transaction(async (tx) => {
		// 1. Проверки счёта
		const account = await tx.account.findUnique({ where: { id: accountId } });
		if (!account) throw new Error("accountNotFound");
		if (account.userId !== userId) throw new Error("unauthorized");
		if (isBuy && account.freeMargin < totalUSD)
			throw new Error("insufficientFunds");

		// 2. Записываем Trade
		const trade = await tx.trade.create({
			data: {
				userId,
				accountId,
				asset,
				type: tradeType,
				quantity,
				price,
				total: isBuy ? -totalUSD : totalUSD, // расход/приход
				status: "Completed",
				startDate: new Date(),
				endDate: new Date(),
				takeProfit,
				stopLoss,
			},
		});	
			// новая позиция
			await tx.position.create({
				data: {
					accountId,
					userId,
					asset,
					type: tradeType,
					quantity: quantity,
					entry: price,
					current: 0,
					pnl: 0,
					status: "Active",
					date: new Date(),
					startDate: new Date(),
				},
			});
		
		await tx.account.update({
			where: { id: accountId },
			data: {
				freeMargin: { increment: isBuy ? -totalUSD : totalUSD },
			},
		});
		revalidatePath("/dashboard");
		return trade;
	});
}
