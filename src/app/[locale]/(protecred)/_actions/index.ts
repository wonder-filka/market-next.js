import { prisma } from "@/lib/db";
import { UserAsset } from "../../../../../prisma/generated/prisma";

// Получить все UserAsset для пользователя по userId
export async function getUsersAssets(): Promise<UserAsset[]> {
	try {
		const assets = await prisma.userAsset.findMany({
			orderBy: { createdAt: "desc" },
			where: {
				deletedAt: null, // deletedAt РАВНО null — только не удалённые
			},
		});
		return assets;
	} catch (error) {
		console.error("Ошибка получения активов пользователя:", error);
		return [];
	}
}

export async function getUserAssets(userId: string): Promise<UserAsset[]> {
	try {
		const assets = await prisma.userAsset.findMany({
			where: { userId, deletedAt: null }, // deletedAt РАВНО null — только не удалённые
			orderBy: { createdAt: "desc" }, // Самые новые первыми
		});
		return assets;
	} catch (error) {
		console.error("Ошибка получения активов пользователя:", error);
		return [];
	}
}
