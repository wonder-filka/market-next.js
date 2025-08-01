"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createOrUpdateUserAsset(
	userId: string,
	asset: string,
	priceBuy: number,
	priceSell: number
) {
	try {
		// 1. Пытаемся найти любой актив (в т.ч. "удалённый")
		const existing = await prisma.userAsset.findUnique({
			where: { userId_asset: { userId, asset } },
		});
		if (existing) {
			// Если "удалённый" — реанимируем, если нет — просто апдейтим
			const updated = await prisma.userAsset.update({
				where: { userId_asset: { userId, asset } },
				data: { priceBuy, priceSell, deletedAt: null },
			});
			revalidatePath("/admin");
			return updated;
		} else {
			// Нет — создаём
			const created = await prisma.userAsset.create({
				data: { userId, asset, priceBuy, priceSell },
			});
			revalidatePath("/admin");
			return created;
		}
	} catch (error) {
		console.error("Ошибка при сохранении userAsset:", error);
		throw new Error("Не удалось сохранить актив");
	}
}

export async function getAllPositionsWithRelations() {
	try {
		const positions = await prisma.position.findMany({
			include: {
				user: {
					include: {
						wallet: true,
						accounts: true,
					},
				},
				account: true,
			},
			orderBy: {
				createdAt: "desc", // новые первыми
			},
		});
		return positions;
	} catch (error) {
		console.error("Ошибка при получении позиций:", error);
		throw new Error("Не удалось получить позиции");
	}
}

export async function deleteUserAsset(userId: string, asset: string) {
	try {
		await prisma.userAsset.updateMany({
			where: {
				userId,
				asset,
				deletedAt: null,
			},
			data: {
				deletedAt: new Date(),
			},
		});
		revalidatePath("admin");
		return true;
	} catch (error) {
		console.error("Ошибка при удалении userAsset:", error);
		throw error;
	}
}
