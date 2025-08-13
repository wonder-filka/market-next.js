"use server";

import { prisma } from "@/lib/db";

export async function getUserWallets(userId: string) {
	try {
		const wallets = await prisma.cryptoWallet.findMany({
			where: { userId },
			select: { currency: true, address: true },
		});

		const btc = wallets.find((w) => w.currency === "BTC");
		const usdt = wallets.find((w) => w.currency === "USDT");

		return { btc, usdt };
	} catch (error) {
		console.error(error);
		return { message: "error get wallets" };
	}
}
