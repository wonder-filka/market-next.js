'use server';

import { getSessionUserId } from '@/lib/session';
import { getUser } from '../_actions';
import { getI18n } from '@/locales/server';
import WithdrawComponent from './_components/withdraw-component';

export default async function Page() {
	const t = await getI18n()
	const userId = await getSessionUserId();
	if (!userId) return null;

	const user = await getUser(userId);
	if ("message" in user) return null;



	return (
		<main className="p-4 space-y-4">
			<h1 className="text-2xl font-bold text-center">{t("withdraw.title")}</h1>
			<WithdrawComponent wallet={user.wallet} />
		</main>
	);
}
