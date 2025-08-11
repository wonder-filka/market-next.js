'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { toast } from "sonner"
import { User, Wallet } from "../../../../../prisma/generated/prisma"
import { topUpWallet } from "../_actions"

type WalletWithUser = Wallet & {
	user: User | null;
}


type TopUpDialogProps = {
	open: boolean
	onOpenChange: (v: boolean) => void
	wallet: WalletWithUser
}

export function TopUpWalletDialog({ open, onOpenChange, wallet }: TopUpDialogProps) {
	const [amount, setAmount] = useState("")
	const [loading, setLoading] = useState(false)

	if (!wallet) return null

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		const result = await topUpWallet(wallet.id, parseFloat(amount))
		if ("message" in result) {
			setAmount("")
			onOpenChange(false)
			toast.error("Ошибка при пополнении")
		} else {
			onOpenChange(false)
			toast.success("Баланс успешно пополнен")
		}
		setLoading(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Пополнение кошелька</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<div className="mb-1 text-sm text-gray-700">Пользователь:</div>
						<div className="font-medium">
							{wallet.user ? `${wallet.user.firstName} ${wallet.user.lastName} (${wallet.user.email})` : "—"}
						</div>
					</div>
					<div>
						<div className="mb-1 text-sm text-gray-700">Сумма пополнения</div>
						<Input
							type="number"
							value={amount}
							min={0}
							step={0.01}
							onChange={e => setAmount(e.target.value)}
							placeholder="0.00"
							disabled={loading}
							required
						/>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
							Отмена
						</Button>
						<Button type="submit" disabled={loading || !amount}>
							Пополнить
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
