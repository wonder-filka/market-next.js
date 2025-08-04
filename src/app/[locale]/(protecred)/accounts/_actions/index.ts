"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Account, Wallet } from "../../../../../../prisma/generated/prisma";

function genMt5Id() {
	// 9 случайных цифр + префикс "mt"
	const num = Math.floor(Math.random() * 1_000_000_000)
		.toString()
		.padStart(9, "0");
	return `mt${num}`; // например: "mt004582371"
}

export async function createAccount(currency: string, userId: string) {
	try {
		if (!userId) throw new Error("Unauthorized");

		const account = await prisma.account.create({
			data: {
				userId,
				currency,
				mt5Id: genMt5Id(),
				type: "hedging",
				isDemo: false,
				balance: 0,
				freeMargin: 0,
			},
		});

		revalidatePath("/accounts");
		return account;
	} catch (error) {
		console.error("❌ Ошибка при создании аккаунта:", error);
		return { message: "accountCreationFailed" };
	}
}

type TransferInput = {
	wallet: Wallet;
	account: Account;
	amount: number;
};

export async function transferFundsToAccount({
	wallet,
	account,
	amount,
	rates,
}: TransferInput & { rates: Record<string, number> }) {
	try {
		// amount — в USD!
		const available = wallet.balance - (wallet.withdrawn ?? 0);
		if (available < amount) throw new Error("insufficientFunds");

		let creditedAmount = amount;
		if (account.currency !== "USD") {
			const rate = rates[account.currency];
			if (!rate) throw new Error("rateNotFound");
			creditedAmount = amount * rate; // USD → EUR (или другая валюта)
		}

		await prisma.$transaction([
			prisma.wallet.update({
				where: { id: wallet.id },
				data: {
					withdrawn: (wallet.withdrawn ?? 0) + amount,
				},
			}),
			prisma.account.update({
				where: { id: account.id },
				data: {
					balance: account.balance + creditedAmount,
					freeMargin: account.freeMargin + creditedAmount,
				},
			}),
		]);
		revalidatePath("/accounts");
	} catch {
		return { message: "transferFailed" };
	}
}

export async function getUser(userId: string) {
	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			include: { wallet: true, accounts: true },
		});
		return user;
	} catch (error) {
		console.error("[GetUser]", error);
		throw new Error("userFetchFailed");
	}
}

export async function withdrawFromAccountToWallet({
	accountId,
	amount,
	rateToUSD,
}: {
	accountId: string;
	amount: number;
	rateToUSD: number;
}) {
	const account = await prisma.account.findUnique({
		where: { id: accountId },
		include: { user: { include: { wallet: true } } },
	});

	if (!account) throw new Error("accountNotFound");
	const wallet = account.user.wallet;
	if (account.freeMargin < amount) throw new Error("insufficientFunds");
	const amountInUSD = +(amount * (rateToUSD ?? 1)).toFixed(2);

	await prisma.$transaction([
		prisma.account.update({
			where: { id: accountId },
			data: {
				balance: account.balance - amount,
				freeMargin: account.freeMargin - amount,
			},
		}),
		prisma.wallet.update({
			where: { id: wallet.id },
			data: {
				balance: wallet.balance + amountInUSD,
			},
		}),
	]);
	revalidatePath("/accounts");
}

type CreateDemoAccountInput = {
	userId: string;
};

export async function createDemoAccount({ userId }: CreateDemoAccountInput) {
	if (!userId) {
		throw new Error("User ID is required");
	}

	const existingDemo = await prisma.account.findFirst({
		where: { userId, isDemo: true },
	});

	if (existingDemo) {
		throw new Error("Demo account already exists");
	}

	const account = await prisma.account.create({
		data: {
			userId,
			balance: 200000,
			currency: "USD",
			isDemo: true,
			freeMargin: 200000, // если есть поле freeMargin
			mt5Id: genMt5Id(),
			type: "demo",
			// добавь здесь другие нужные поля, например, mt5Id, если нужно
		},
	});

	// Можно сбросить кеш, если используется SSR/ISR:
	revalidatePath("/accounts");

	return account;
}
