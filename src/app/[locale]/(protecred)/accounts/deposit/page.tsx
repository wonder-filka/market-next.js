'use server';

import { getSessionUserId } from '@/lib/session';

import { getRates } from '@/lib/rates';
import { getUser } from '../_actions';
import DepositComponent from './_components/deposit-component';
import { getI18n } from '@/locales/server';
import { getUserWallets } from './_actions';


export default async function Page() {
	const t = await getI18n()
	const userId = await getSessionUserId();
	if (!userId) return null;

	const user = await getUser(userId);
	if ("message" in user) return null;

	const rates = await getRates();

	const safeRates: Record<string, number> = Object.fromEntries(
		Object.entries(rates)
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			.filter(([_, v]) => typeof v === "number" && !isNaN(v))
			.map(([k, v]) => [k, v as number])
	);

	const { btc, usdt } = await getUserWallets(userId);

	return (
		<main className="p-4 space-y-4">
			<h1 className="text-2xl font-bold text-center">{t("depositFunds")}</h1>
			<DepositComponent safeRates={safeRates} userId={userId} btcAddress={btc?.address ?? null}
				usdtAddress={usdt?.address ?? null} />
		</main>
	);
}
