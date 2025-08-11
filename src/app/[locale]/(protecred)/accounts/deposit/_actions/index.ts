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

type Currency = "BTC" | "USDT";

export async function getOrCreateWallet(userId: string, currency: Currency) {
	try {
		const existing = await prisma.cryptoWallet.findUnique({
			where: { userId_currency: { userId, currency } },
		});
		if (existing) return existing;

		let generated: { address: string; privateKey: string };
		let chain: "BITCOIN" | "ETHEREUM";

		if (currency === "BTC") {
			generated = await createBitcoinWallet();
			chain = "BITCOIN";
		} else {
			generated = await createUsdtErc20Wallet();
			chain = "ETHEREUM";
		}

		return await prisma.cryptoWallet.create({
			data: {
				userId,
				currency,
				chain,
				address: generated.address,
				privateKeyEncrypted: generated.privateKey,
			},
		});
	} catch (error) {
		console.error(`getOrCreateWallet(${currency}) error:`, error);
		return { message: `Ошибка при создании кошелька ${currency}` };
	}
}
