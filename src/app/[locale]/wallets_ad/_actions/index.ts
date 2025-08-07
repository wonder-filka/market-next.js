"use server";

import { prisma } from "@/lib/db";
import { User, Wallet } from "../../../../../prisma/generated/prisma";
import { revalidatePath } from "next/cache";

/**
 * Получить все кошельки всех пользователей
 */
export async function getAllWallets(): Promise<
	(Wallet & { user: User | null })[]
> {
	try {
		const wallets = await prisma.wallet.findMany({
			include: {
				user: true, // чтобы сразу получать и юзера, если нужно
			},
			orderBy: { createdAt: "desc" }, // опционально: сортировка по дате
		});
		return wallets;
	} catch (error) {
		console.error("[getAllWallets]", error);
		throw new Error("Не удалось получить кошельки пользователей");
	}
}

export async function topUpWallet(walletId: string, amount: number) {
	if (amount <= 0) throw new Error("amountInvalid");
	try {
		const wallet = await prisma.wallet.update({
			where: { id: walletId },
			data: { balance: { increment: amount } },
		});
		revalidatePath("/wallets_ad")
		return wallet;
	} catch {
		return { message: "error" };
	}
}
