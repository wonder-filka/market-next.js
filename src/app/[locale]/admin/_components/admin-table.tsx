'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { changePositionPrice } from "../_actions"
import { toast } from "sonner"
import { PositionWithRelations } from "../_actions/types"
import { useReactTable, getCoreRowModel, ColumnDef, flexRender, ColumnFiltersState, getFilteredRowModel } from "@tanstack/react-table"
import { format } from "date-fns"

const columns: ColumnDef<PositionWithRelations>[] = [
	{
		accessorKey: "userName",
		header: () => "Имя пользователя",
		cell: ({ row }) =>
			`${row.original.user.firstName} ${row.original.user.lastName}`,
		enableGlobalFilter: true,
		accessorFn: row => `${row.user.firstName} ${row.user.lastName}`,
	},
	{
		accessorKey: "userEmail",
		header: () => "Имеил пользователя",
		cell: ({ row }) => row.original.user.email,
		enableGlobalFilter: true,
		accessorFn: row => row.user.email,
	},
	{
		accessorKey: "mt5Id",
		header: () => "Номер кошелька",
		cell: ({ row }) => row.original.account.mt5Id,
		enableGlobalFilter: true,
		accessorFn: row => row.account.mt5Id,
	},
	{
		accessorKey: "currency",
		header: () => "Валюта",
		cell: ({ row }) => row.original.account.currency,
	},
	{
		accessorKey: "asset",
		header: () => "Актив",
		cell: ({ row }) => row.original.asset,
		enableGlobalFilter: true,
	},
	{
		accessorKey: "type",
		header: () => "Тип",
		cell: ({ row }) => row.original.type,
	},
	{
		accessorKey: "quantity",
		header: () => "Количество",
		cell: ({ row }) => row.original.quantity,
	},
	{
		accessorKey: "entry",
		header: () => "Цена входа",
		cell: ({ row }) => row.original.entry,
	},
	{
		accessorKey: "current",
		header: () => "Текущая цена",
		cell: ({ row }) => row.original.current,
		enableGlobalFilter: true,
	},
	{
		accessorKey: "pnl",
		header: () => "Доход",
		cell: ({ row }) => row.original.pnl,
	},
	{
		accessorKey: "startDate",
		header: () => "Дата открытия",
		cell: ({ row }) => format(new Date(row.original.startDate), "dd.MM.yyyy, HH:mm:ss"),
		enableGlobalFilter: true,
		accessorFn: row => new Date(row.startDate).toLocaleString()
	},
	{
		accessorKey: "endDate",
		header: () => "Дата закрытия",
		cell: ({ row }) =>
			row.original.endDate
				? new Date(row.original.endDate).toLocaleString()
				: "-",
	},
	{
		accessorKey: "status",
		header: () => "Статус",
		cell: ({ row }) => row.original.status,
	},
]

export const AdminTable = ({ data }: { data: PositionWithRelations[] }) => {
	const [newPrice, setNewPrice] = useState("")
	const [selectedPosition, setSelectedPosition] = useState<PositionWithRelations | null>(null)
	const [result, setResult] = useState(0)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [globalFilter, setGlobalFilter] = useState('')

	const handleSave = async () => {
		if (!selectedPosition || !newPrice) return
		try {
			await changePositionPrice(selectedPosition.id, parseFloat(newPrice), result)
			toast.success("Цена успешно изменена")
			setIsDialogOpen(false)
			setNewPrice("")
			setResult(0)
			setSelectedPosition(null)
		} catch (error) {
			toast.error("Ошибка при изменении цены позиции")
		}
	}

	const handleOpenDialog = (item: PositionWithRelations) => {
		setSelectedPosition(item)
		setNewPrice(item.entry.toString())
		if (item.current) {
			setResult(calculateResult(item.current.toString()))
		} else {
			setResult(0)
		}
		setIsDialogOpen(true)
	}

	const handleCloseDialog = () => {
		setIsDialogOpen(false)
		setNewPrice("")
		setResult(0)
		setSelectedPosition(null)
	}

	const calculateResult = (price: string) => {
		if (!selectedPosition) return 0
		const priceVal = parseFloat(price) || 0
		if (priceVal === 0) return 0

		return selectedPosition.type.toLowerCase() === "buy"
			? (priceVal - selectedPosition.entry) * selectedPosition.quantity
			: (selectedPosition.entry - priceVal) * selectedPosition.quantity
	}

	const handlePriceChange = (value: string) => {
		setNewPrice(value)
		const calc = calculateResult(value)
		setResult(calc)
	}

	// Add the edit column
	const table = useReactTable({
		data,
		columns: [
			...columns,
			{
				id: "edit",
				header: () => null,
				cell: ({ row }) => {
					const item = row.original
					return item.status === "Active" ? (
						<Button
							variant="link"
							onClick={() => handleOpenDialog(item)}
						>
							Редактировать
						</Button>
					) : null
				},
			},
		],

		state: {
			columnFilters,
			globalFilter,
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
	})

	return (
		<>
			<Card>
				<CardContent>
					<div className='flex items-center justify-between'>
						<Input
							placeholder=''
							className='md:max-w-sm'
							value={globalFilter}
							onChange={e => setGlobalFilter(e.currentTarget.value)}
						/>

					</div>
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead key={header.id}>
											{flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Изменить цену</DialogTitle>
						<DialogDescription>
							{selectedPosition && (
								<>
									Тип сделки: {selectedPosition.type === "Buy" ? "Покупка" : "Продажа"} <br />
									Актив: {selectedPosition.asset} <br />
								</>
							)}
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={(e) => {
						e.preventDefault();
						handleSave();
					}}>
						<div className="mb-4">
							<Input
								value={newPrice}
								type="number"
								step="any"
								placeholder="Введите новую цену"
								onChange={(e) => handlePriceChange(e.target.value)}
								autoFocus
							/>
						</div>

						<div className="text-sm mb-4">
							Доход/убыток:
							<span
								className={
									result >= 0
										? "text-green-600"
										: "text-red-600"
								}
							>
								{` ${result.toFixed(2)}`}
							</span>
						</div>

						<div className="flex gap-2">
							<Button type="button" variant="outline" onClick={handleCloseDialog}>
								Отмена
							</Button>
							<Button type="submit">
								Сохранить
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</>
	)
}