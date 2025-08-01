"use server";

import { Account, Position } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getUserOpenPositions(
	userId: string
): Promise<Position[]> {
	try {
		const positions = await prisma.position.findMany({
			where: { userId, status: { not: "Closed" } },
			orderBy: { date: "desc" },
		});
		return positions;
	} catch (error) {
		console.error("Ошибка получения позиций:", error);
		return [];
	}
}

export async function closePosition(
	pos: Position,
	account: Account, // account (с валютой) — лучше подтянуть заранее
	rates: Record<string, number>, // USD/EUR = 0.91 и т.д.
	currentPrice: number // цена закрытия позиции
) {
	try {
		if (!pos) throw new Error("positionNotFound");
		if (pos.status !== "Active") throw new Error("alreadyClosed");

		// 1. Рассчитываем pnl в USD:
		const pnlUsd =
			pos.type === "Buy"
				? (currentPrice - pos.entry) * pos.quantity
				: (pos.entry - currentPrice) * pos.quantity;

		// 2. Сумма для возврата на счет (в USD):
		// Важно: возвращаем только margin + pnl, то есть всю сумму, которая была заложена в сделку + результат.
		const returnUsd = pos.entry * pos.quantity + pnlUsd;
		const rate = account.currency === "USD" ? 1 : rates[account.currency];
		// 3. Переводим в валюту аккаунта
		let returnAmount = returnUsd;
		const pnl = account.currency === "USD" ? pnlUsd : pnlUsd * rate!;
		if (account.currency !== "USD") {
			const rate = rates[account.currency]; // например, USD/EUR
			if (!rate) throw new Error("rateNotFound");
			returnAmount = returnUsd * rate;
		}

		await prisma.$transaction([
			prisma.trade.create({
				data: {
					accountId: pos.accountId,
					userId: pos.userId,
					asset: pos.asset,
					type: pos.type === "Buy" ? "Sell" : "Buy",
					quantity: pos.quantity,
					price: currentPrice,
					total: pnlUsd,
					status: "Completed",
					startDate: new Date(),
					endDate: new Date(),
				},
			}),
			prisma.position.update({
				where: { id: pos.id },
				data: {
					status: "Closed",
					pnl: pnl,
					endDate: new Date(),
				},
			}),
			prisma.account.update({
				where: { id: pos.accountId },
				data: {
					balance: { increment: pnl },
					freeMargin: { increment: returnAmount },
				},
			}),
		]);
		revalidatePath("/portfolio");
		return { success: true, message: "Position closed successfully" };
	} catch (error) {
		console.error("❌ Error closing position:", error);
		return null;
	}
}
