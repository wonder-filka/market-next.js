import { getSessionUserId } from "@/lib/session";

import { getUser } from "../(protecred)/accounts/_actions";
import { getAllWallets } from "./_actions";
import { WalletsTable } from "./_components/wallets-table";


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

	return (
		<main className="p-4 space-y-4">
			<div className="grid grid-cols-1">
				<WalletsTable wallets={info} />
			</div>
		</main>

	)
}
