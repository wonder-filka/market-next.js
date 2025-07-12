'use client'

import { Card, CardContent } from "@/components/ui/card"
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { changePositionPrice } from "../_actions"
import { Position } from "@/generated/prisma"
import { toast } from "sonner"


export const AdminTable = ({ data }: { data: any[] }) => {
	console.log("AdminTable data:", data)
	const [newPrice, setNewPrice] = useState("");
	const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
	const [result, setResult] = useState(0);
	const [openDialogId, setOpenDialogId] = useState<string | null>(null)
	const handleSave = async () => {
		console.log("Saving new price:", newPrice, "for position:", selectedPosition);
		if (!selectedPosition || !newPrice) return
		try {
			await changePositionPrice(selectedPosition.id, parseFloat(newPrice), result);
			toast.success("Цена успешно изменена")
			setOpenDialogId(null)
		} catch (error) {
			toast.error("Ошибка при изменении цены позиции")
		}
	}

	return (
		<Card>
			<CardContent>
				<Table>
					<TableCaption>Список позиций</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">Имя пользователя</TableHead>
							<TableHead>Имеил пользователя</TableHead>
							<TableHead>Номер кошелька</TableHead>
							<TableHead>Валюта</TableHead>
							<TableHead>Актив</TableHead>
							<TableHead>Тип</TableHead>
							<TableHead>Количество</TableHead>
							<TableHead>Цена входа</TableHead>
							<TableHead>Текущая цена</TableHead>
							<TableHead>Доход</TableHead>
							<TableHead>Дата открытия</TableHead>
							<TableHead>Дата закрытия</TableHead>
							<TableHead>Статус</TableHead>
							<TableHead></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((item) => (
							<TableRow key={item.id}>
								<TableCell>{item.user.firstName} {item.user.lastName}</TableCell>
								<TableCell>{item.user.email}</TableCell>
								<TableCell>{item.account.mt5Id}</TableCell>
								<TableCell>{item.account.currency}</TableCell>
								<TableCell>{item.asset}</TableCell>
								<TableCell>{item.type}</TableCell>
								<TableCell>{item.quantity}</TableCell>
								<TableCell>{item.entry}</TableCell>
								<TableCell>{item.current}</TableCell>
								<TableCell>{item.pnl}</TableCell>
								<TableCell>{new Date(item.startDate).toLocaleString()}</TableCell>
								<TableCell>{item.endDate ? new Date(item.endDate).toLocaleString() : "-"}</TableCell>
								<TableCell>{item.status}</TableCell>
								<TableCell>
									{
										item.status === "Active" && (
											<Dialog
												open={openDialogId === item.id}
												onOpenChange={(isOpen) => {
													if (!isOpen) {
														setResult("")
														setNewPrice("")
														setSelectedPosition(null)
													} else {
														setSelectedPosition(item)
													}
													setOpenDialogId(isOpen ? item.id : null)
												}}
											>
												<DialogTrigger asChild>
													<Button variant="link" >Редактировать</Button>
												</DialogTrigger>
												<DialogContent>
													<DialogHeader>
														<DialogTitle>
															Изменить цену
														</DialogTitle>
														<DialogDescription>
															Тип сделки: {item.type === "Buy" ? "Покупка" : "Продажа"} <br />
															Актив: {item.asset} <br />
														</DialogDescription>
													</DialogHeader>
													<form onSubmit={(e) => { e.preventDefault(); handleSave() }}>
														<div>
															<Input
																defaultValue={item.entry}
																onChange={(e) => {
																	const priceVal = parseFloat(e.target.value)
																	setNewPrice(e.target.value)
																	// расчет дохода или убытка:
																	// для Buy: (newPrice - entry) * quantity
																	// для Sell: (entry - newPrice) * quantity
																	const calc =
																		item.type.toLowerCase() === "buy"
																			? (priceVal - item.entry) * item.quantity
																			: (item.entry - priceVal) * item.quantity

																	setResult(calc)
																}}
															/>
														</div>

														<div className="text-sm">
															Доход/убыток:
															<span
																className={
																	result >= 0
																		? "text-green-600"
																		: "text-red-600"
																}
															>
																{result.toFixed(2)}
															</span>
														</div>
														<Button type="submit" className="mt-4">Сохранить</Button>
													</form>

												</DialogContent>
											</Dialog>
										)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}