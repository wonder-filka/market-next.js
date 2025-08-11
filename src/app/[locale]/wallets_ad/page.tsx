import { getSessionUserId } from "@/lib/session";

import { getUser } from "../(protecred)/accounts/_actions";
import { getAllWallets } from "./_actions";
import { WalletsTable } from "./_components/wallets-table";
import { getRates } from "@/lib/rates";


export default async function Page() {
	const userId = await getSessionUserId()
	if (!userId) {
		return null
	}
	const user = await getUser(userId)
	const adminId = process.env.ADMIN_ID;
	if ("message" in user) return null;

	if (user.id !== adminId) {
		return null
	}

	const info = await getAllWallets()
	const rates = await getRates();

	const safeRates: Record<string, number> = Object.fromEntries(
		Object.entries(rates)
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			.filter(([_, v]) => typeof v === "number" && !isNaN(v))
			.map(([k, v]) => [k, v as number])
	);
	return (
		<main className="p-4 space-y-4">
			<div className="grid grid-cols-1">
				<WalletsTable wallets={info} safeRates={safeRates}/>
			</div>
		</main>

	)
}
