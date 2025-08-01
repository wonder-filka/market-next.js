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
		const record = await prisma.userAsset.upsert({
			where: { userId_asset: { userId, asset } },
			update: { priceBuy, priceSell },
			create: { userId, asset, priceBuy, priceSell },
		});
		revalidatePath("admin");
		return record;
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
