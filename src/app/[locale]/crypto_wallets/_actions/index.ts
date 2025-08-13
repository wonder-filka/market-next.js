"use server";

import { prisma } from "@/lib/db";
import {  CryptoWallet, User } from "../../../../../prisma/generated/prisma";

/**
 * Получить все кошельки всех пользователей
 */
export async function getAllCryptoWallets(): Promise<
	(CryptoWallet & { User: (User) | null })[]
> {
	try {
		const wallets = await prisma.cryptoWallet.findMany({
			include: {
				User: true
			},
			orderBy: { createdAt: "desc" }, // опционально: сортировка по дате
		});
		return wallets;
	} catch (error) {
		console.error("[getAllCryptoWallets]", error);
		throw new Error("Не удалось получить кошельки");
	}
}

