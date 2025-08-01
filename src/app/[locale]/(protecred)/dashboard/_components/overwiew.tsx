'use client'

import { Account, UserAsset } from "@/generated/prisma"
import { VolatileTable } from "./tables/volatile-table"
import { QuoteChartPanel } from "./quote-chart-panel"
import { TopGainers } from "./tables/top-gainers"
import { TopLosers } from "./tables/top-losers"
import { CategoryPanel } from "./category-panel"
import { LiveQuote, UserWithWalletAndAccounts } from "@/lib/types"
import { useQuotesStore } from "@/stores/quotes-store"
import { useEffect } from "react"
import { socket } from "@/socket"
import { onQuotesUpdate } from "../_actions/helpers"
import { LoaderCircle } from "lucide-react"
import { useI18n } from "@/locales/client"

type OverviewProps = {
	user: UserWithWalletAndAccounts
	userAssets: UserAsset[]
	userId: string
	rates: Record<string, number>
}

export function Overview({
	user,
	userAssets,
	userId,
	rates
}: OverviewProps) {
	const { liveQuotes, setLiveQuotes } = useQuotesStore()
	const t = useI18n()
	useEffect(() => {
		if (!socket.connected) {
			socket.connect();
		}
		const onQuotesUpdates = (newQuotes: LiveQuote[]) => {
			onQuotesUpdate(newQuotes, userAssets, setLiveQuotes);
			console.log('Quotes updated:', newQuotes);
		};

		socket.on("quotes-update", onQuotesUpdates);
		return () => {
			socket.off("quotes-update", onQuotesUpdates);
		};
	}, [userAssets, setLiveQuotes])


	if (liveQuotes.length === 0) {
		return <div className='w-full min-h-[90vh] flex justify-center items-center space-x-2'>
			<LoaderCircle size={25} className='text-gray-500 animate-spin' />
		</div>
	}

	return (
		<>
			<h1 className="text-2xl font-bold">{t("dashboardGreeting")}, {user.firstName}</h1>
			<div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
				<div className="space-y-6 col-span-1 xl:col-span-2">
					<VolatileTable />
				</div>
				<div className="space-y-6 col-span-1 xl:col-span-3">
					<QuoteChartPanel accounts={user.accounts} userId={userId} rates={rates} />
				</div>
			</div>
			<div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
				<div className="space-y-6 col-span-1 xl:col-span-2">
					<TopGainers />
					<TopLosers />
				</div>
				<div className="space-y-6 col-span-1 xl:col-span-3">
					<CategoryPanel />
				</div>
			</div>

		</>
	)
}