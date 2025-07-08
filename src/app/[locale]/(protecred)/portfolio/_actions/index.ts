"use server";

import { Position } from "@/generated/prisma";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function closePosition(pos: Position) {
	try {
		if (!pos) throw new Error("positionNotFound");
		if (pos.status !== "Active") throw new Error("alreadyClosed");

		// 2. Считаем сумму закрытия в USD
		const currentPrice = pos.current;
		const total = currentPrice * pos.quantity;

		// 3. Открываем транзакцию:
		//    - создаём запись Trade типа Sell/Buy (в зависимости от изначального направления)
		//    - обновляем Position → закрываем
		//    - возвращаем средства на счёт (balance и freeMargin)
		await prisma.$transaction([
			prisma.trade.create({
				data: {
					accountId: pos.accountId,
					userId: pos.userId,
					asset: pos.asset,
					type: pos.type === "Buy" ? "Sell" : "Buy",
					quantity: pos.quantity,
					price: currentPrice,
					total: pos.type === "Buy" ? total : -total,
					status: "Completed",
					startDate: new Date(),
					endDate: new Date(),
				},
			}),
			prisma.position.update({
				where: { id: pos.id },
				data: {
					status: "Closed",
					pnl:
						pos.type === "Buy"
							? (currentPrice - pos.entry) * pos.quantity
							: (pos.entry - currentPrice) * pos.quantity,
					date: new Date(),
				},
			}),
			prisma.account.update({
				where: { id: pos.accountId },
				data: {
					balance: { increment: total },
					freeMargin: { increment: total },
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
