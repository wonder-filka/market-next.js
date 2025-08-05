"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import yahooFinance from "yahoo-finance2";
import { Account, TradeType } from "../../../../../../prisma/generated/prisma";

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
				const SPREAD = 0.05;
				return {
					symbol,
					name: symbol,
					price: last?.close ?? 0,
					change: (last?.close ?? 0) - (prev?.close ?? 0),
					buy: last?.close ? last.close + SPREAD : 0,
					sell: last?.close,
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
		console.log(error);
		return [];
	}
}

type CreateTradeInput = {
	userId: string;
	account: Account;
	asset: string;
	type: "buy" | "sell";
	quantity: number;
	price: number;
	takeProfit: number | null;
	stopLoss: number | null;
	rates: Record<string, number>;
};

export async function createTrade(input: CreateTradeInput) {
	const {
		userId,
		account,
		asset,
		type,
		quantity,
		price,
		takeProfit,
		stopLoss,
		rates,
	} = input;

	// price всегда в USD (или USDT), quantity — сколько лотов
	// Надо узнать, сколько это будет в валюте аккаунта
	const totalUSD = price * quantity;

	// Получаем курс: СКОЛЬКО USD в 1 account.currency (например, EUR)
	// rates = { EUR: 0.92, ... } — это USD -> EUR
	let rate = 1;
	if (account.currency !== "USD") {
		rate = rates[account.currency];
		if (!rate) throw new Error("noRate");
	}
	// Сколько нужно списать с аккаунта (например, EUR)
	const totalInAccountCurrency = totalUSD * rate;

	const isBuy = type === "buy";
	const tradeType: TradeType = isBuy ? "Buy" : "Sell";
	if (account.userId !== userId) throw new Error("unauthorized");

	// Проверяем хватает ли денег на счёте (уже в валюте счета!)
	if (isBuy && account.freeMargin < totalInAccountCurrency) {
		return { message: "insufficientFunds" };
	}
	await prisma.$transaction(async (tx) => {
		// Проверка что аккаунт принадлежит пользователю

		// Записываем Trade (total всегда в USD, для истории/аналитики)
		const trade = await tx.trade.create({
			data: {
				userId,
				accountId: account.id,
				asset,
				type: tradeType,
				quantity,
				price,
				total: isBuy ? -totalUSD : totalUSD, // для истории — всегда в USD
				status: "Completed",
				startDate: new Date(),
				endDate: new Date(),
				takeProfit,
				stopLoss,
			},
		});

		// Создаём новую позицию
		await tx.position.create({
			data: {
				accountId: account.id,
				userId,
				asset,
				type: tradeType,
				quantity,
				entry: price,
				current: 0,
				pnl: 0,
				status: "Active",
				date: new Date(),
				startDate: new Date(),
			},
		});

		// Обновляем баланс аккаунта — списываем именно в валюте аккаунта!
		await tx.account.update({
			where: { id: account.id },
			data: {
				freeMargin: { increment: -totalInAccountCurrency },
			},
		});

		revalidatePath("/dashboard");
		return trade;
	});
}
