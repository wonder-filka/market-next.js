import { Download, ArrowUpRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function WalletInterface() {
	return (
		<Card>
			<CardContent className="flex justify-between items-center">
				<div>
					<p className="text-sm text-muted-foreground">Wallet balance</p>
					<p className="text-3xl font-bold">£0.00</p>
				</div>
				<div className="flex gap-3">
					<Button variant="outline" className="flex items-center gap-2">
						<Download className="h-4 w-4" />
						Вывод средств
					</Button>
					<Button variant="outline">
						<ArrowUpRight className="h-4 w-4" />
						Перевести
					</Button>
					<Button>
						<Plus className="h-4 w-4" />
						Пополнить
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
