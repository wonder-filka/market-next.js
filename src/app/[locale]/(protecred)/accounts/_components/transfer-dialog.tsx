'use client'

import { useMemo, useState, useTransition } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/locales/client"
import { toast } from "sonner"
import { transferFundsToAccount } from "../_actions"
import { Account, Wallet } from "../../../../../../prisma/generated/prisma"

type TransferDialogProps = {
	isOpen: boolean
	onClose: () => void
	accounts: Account[]
	wallet: Wallet
	rates: Record<string, number>
}

export function TransferDialog({ isOpen, onClose, accounts, wallet, rates }: TransferDialogProps) {
	const t = useI18n()
	const [amount, setAmount] = useState('')
	const [accountId, setAccountId] = useState('')
	const [pending, startTransition] = useTransition()

	const selectedAccount = accounts.find(acc => acc.id === accountId)
	const targetCurrency = selectedAccount?.currency || "USD"
	const rate = rates[targetCurrency] || 1

	// Считаем сумму для зачисления (чтобы показать)
	const creditedAmount = useMemo(() => {
		if (!amount || !selectedAccount) return ""
		const num = parseFloat(amount)
		if (isNaN(num)) return ""
		if (targetCurrency === "USD") return num.toFixed(2)
		return (num * rate).toFixed(2)
	}, [amount, rate, targetCurrency, selectedAccount])

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
					rates, // обязательно!
				})
				toast.success(t('transferSuccess'), {
					style: { backgroundColor: 'green', color: 'white' }
				})

				onClose()
				setAmount('')
				setAccountId('')
			} catch (err: unknown) {
				let msg = t('error');
				if (
					err &&
					typeof err === 'object' &&
					'message' in err &&
					typeof (err as { message?: unknown }).message === 'string'
				) {
					const errorMsg = (err as { message: string }).message;
					msg = t(errorMsg as keyof typeof t) ?? errorMsg;
				}
				toast.error(msg, {
					style: { backgroundColor: 'red', color: 'white' }
				});
			}
		}
		)
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
						{selectedAccount && targetCurrency !== "USD" && amount && (
							<p className="text-xs mt-1 text-muted-foreground">
								{t('willBeCredited')}: {creditedAmount} {targetCurrency} <br />
								({t('currentRate')}: 1 USD = {rate} {targetCurrency})
							</p>
						)}
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
