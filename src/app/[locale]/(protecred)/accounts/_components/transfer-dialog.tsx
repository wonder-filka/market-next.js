'use client'

import { useState, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/locales/client"
import { Account, Wallet } from "@/generated/prisma"
import { toast } from "sonner"
import { transferFundsToAccount } from "../_actions"

type TransferDialogProps = {
	isOpen: boolean
	onClose: () => void
	accounts: Account[]
	userId: string
	wallet: Wallet
}

export function TransferDialog({ isOpen, onClose, accounts, userId, wallet }: TransferDialogProps) {
	const t = useI18n()
	const [amount, setAmount] = useState('')
	const [accountId, setAccountId] = useState('')
	const [pending, startTransition] = useTransition()

	const handleTransfer = () => {
		if (!amount || !accountId) return
		const selectedAccount = accounts.find(acc => acc.id === accountId)
		if (!selectedAccount) {
			toast.error(t("accountNotFound"), { style: { backgroundColor: "red", color: "white" } })
			return
		}
		startTransition(async () => {
			try {
				await transferFundsToAccount({
					wallet,
					account: selectedAccount,
					amount: parseFloat(amount),

				})

				toast.success(t('transferSuccess'), {
					style: { backgroundColor: 'green', color: 'white' }
				})

				onClose()
				setAmount('')
				setAccountId('')
			} catch (err: any) {
				toast.error(t(err.message || 'error'), {
					style: { backgroundColor: 'red', color: 'white' }
				})
			}
		})
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md bg-gray-900">
				<DialogHeader>
					<DialogTitle>{t('transferFunds')}</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-1">{t('account')}</label>
						<select
							className="w-full bg-background border rounded-md p-2"
							value={accountId}
							onChange={(e) => setAccountId(e.target.value)}
						>
							<option value="">{t('selectAccount')}</option>
							{accounts.map(acc => (
								<option key={acc.id} value={acc.id}>
									{acc.mt5Id} — {acc.currency}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium mb-1">{t('amount')}</label>
						<Input
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="0.00"
						/>
					</div>
				</div>

				<DialogFooter className="pt-4">
					<Button onClick={handleTransfer} disabled={pending || !amount || !accountId}>
						{t('transfer')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
