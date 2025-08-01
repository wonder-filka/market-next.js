'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { createOrUpdateUserAsset, deleteUserAsset } from "../_actions"
import { toast } from "sonner"
import { PositionWithRelations } from "../_actions/types"
import { useReactTable, getCoreRowModel, ColumnDef, flexRender, ColumnFiltersState, getFilteredRowModel } from "@tanstack/react-table"
import { format } from "date-fns"
import { UserAsset } from "@/generated/prisma"
import { quoteNames } from "@/lib/constants"



export const AdminTable = ({ data, userAssets }: { data: PositionWithRelations[], userAssets: UserAsset[] }) => {
	const [newSellPrice, setNewSellPrice] = useState("");
	const [newBuyPrice, setNewBuyPrice] = useState("");
	const [selectedPosition, setSelectedPosition] = useState<PositionWithRelations | null>(null)
	const [result, setResult] = useState(0)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [globalFilter, setGlobalFilter] = useState('')
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
	const [deleteTarget, setDeleteTarget] = useState<{ userId: string; asset: string } | null>(null)

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
			cell: ({ row }) => {
				return (
					<>
						{quoteNames[row.original.asset]?.["ru"]}
					</>
				)
			},
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
			accessorKey: "currentSell",
			header: () => "Текущая цена продажи",
			cell: ({ row }) => {
				const pos = row.original;
				const userSellPrice = getUserAssetPrice(pos.asset, pos.userId, userAssets, "Sell");
				return userSellPrice !== null ? (
					<span className="text-blue-600 font-semibold">{userSellPrice}</span>
				) : 0;
			},
		},
		{
			accessorKey: "currentBuy",
			header: () => "Текущая цена покупки",
			cell: ({ row }) => {
				const pos = row.original;
				const userBuyPrice = getUserAssetPrice(pos.asset, pos.userId, userAssets, "Buy");
				return userBuyPrice !== null ? (
					<span className="text-blue-600 font-semibold">{userBuyPrice}</span>
				) : 0;
			},
		},
		{
			accessorKey: "pnl",
			header: () => "Доход",
			cell: ({ row }) => {
				const pos = row.original;
				const userBuy = getUserAssetPrice(pos.asset, pos.userId, userAssets, "Buy");
				const userSell = getUserAssetPrice(pos.asset, pos.userId, userAssets, "Sell");
				// Получаем значения buy/sell из quotes для этого актива (нужно передать buyMap, sellMap в компонент)
				const buy = 0;
				const sell = 0;

				let currentPrice: number;
				if (pos.type === "Buy") {
					currentPrice = userBuy !== null ? userBuy : sell;
				} else {
					currentPrice = userSell !== null ? userSell : buy;
				}
				const pnl = pos.type === "Buy"
					? (currentPrice - pos.entry) * pos.quantity
					: (pos.entry - currentPrice) * pos.quantity;
				return (
					<span className={pnl >= 0 ? "text-green-600" : "text-red-600"}>
						{pnl}
					</span>
				);
			},
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
					? format(new Date(row.original.endDate), "dd.MM.yyyy, HH:mm:ss")
					: "-",
		},
		{
			accessorKey: "status",
			header: () => "Статус",
			cell: ({ row }) => row.original.status,
		}
	]

	function openDeleteDialog(userId: string, asset: string) {
		setDeleteTarget({ userId, asset });
		setDeleteDialogOpen(true);
	}

	const handleSave = async () => {
		if (!selectedPosition || !newSellPrice) return
		try {
			await createOrUpdateUserAsset(
				selectedPosition.userId,
				selectedPosition.asset,
				parseFloat(newBuyPrice),
				parseFloat(newSellPrice)
			)
			toast.success("Цена успешно изменена")
			setIsDialogOpen(false)
			setNewSellPrice("");
			setNewBuyPrice("");
			setResult(0)
			setSelectedPosition(null)
		} catch (error) {
			toast.error("Ошибка при изменении цены позиции")
		}
	}

	const handleOpenDialog = (item: PositionWithRelations) => {
		setSelectedPosition(item);
		const defaultSell = item.entry.toString();
		const defaultBuy = (item.entry + 0.05).toString();
		setNewSellPrice(defaultSell);
		setNewBuyPrice(defaultBuy);
		setResult(item.current ? calculateResult(item.current.toString()) : 0);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false)
		setNewSellPrice("");
		setNewBuyPrice("");
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

	const handleSellPriceChange = (value: string) => {
		setNewSellPrice(value);
		setNewBuyPrice((parseFloat(value) + 0.05).toString());
		const v = parseFloat(value) || 0;
		setResult(calculateResult((v).toString()));
	};

	const handleBuyPriceChange = (value: string) => {
		setNewBuyPrice(value);
		const v = parseFloat(value) || 0;
		setNewSellPrice(v ? (v - 0.05).toString() : "");
		// Опционально: если хотите вычислять result по buy
		setResult(calculateResult((v).toString()));
	};

	async function handleDeletePrice() {
		if (!deleteTarget) return
		try {
			await deleteUserAsset(deleteTarget.userId, deleteTarget.asset);
			toast.success("Цена удалена");
			setDeleteDialogOpen(false);
			setDeleteTarget(null);
			// Если нужно — обновить userAssets (setUserAssets или refetch)
		} catch (error) {
			toast.error("Ошибка при удалении цены");
		}
	}

	function getUserAssetPrice(
		asset: string,
		userId: string,
		userAssets: UserAsset[] | undefined,
		type: "Buy" | "Sell"
	) {
		const found = userAssets?.find(a => a.asset === asset && a.userId === userId)
		if (!found) return null
		return type === "Buy" ? found.priceBuy : found.priceSell
	}

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
			{
				id: "deletePrice",
				header: () => "Удалить цену",
				cell: ({ row }) => {
					const pos = row.original;
					return pos.status === "Active" ? (
						<Button
							variant="destructive"
							size="sm"
							onClick={() => openDeleteDialog(pos.userId, pos.asset)}
						>
							Удалить
						</Button>
					) : null;
				},
			}
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
									Актив: {quoteNames[selectedPosition.asset]?.["ru"]} <br />
								</>
							)}
						</DialogDescription>
					</DialogHeader>
					<form onSubmit={(e) => {
						e.preventDefault();
						handleSave();
					}}>
						{selectedPosition && selectedPosition.type === "Buy" && (
							<div className="mb-4">
								<label className="block text-sm font-medium mb-1">Цена покупки</label>
								<Input
									defaultValue={selectedPosition.entry}
									type="number"
									step="any"
									placeholder="Цена покупки"
									onChange={(e) => handleBuyPriceChange(e.target.value)}

								/>
							</div>
						)}
						{selectedPosition && selectedPosition.type === "Sell" && (
							<div className="mb-4">
								<label className="block text-sm font-medium mb-1">Цена продажи</label>
								<Input
									defaultValue={selectedPosition.entry}
									type="number"
									step="any"
									placeholder="Введите цену продажи"
									onChange={(e) => handleSellPriceChange(e.target.value)}
									autoFocus
								/>
							</div>
						)}
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
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Подтвердить удаление</DialogTitle>
						<DialogDescription>
							Вы уверены, что хотите удалить цену для выбранного актива?
						</DialogDescription>
					</DialogHeader>
					<div className="flex gap-2 mt-4">
						<Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
							Отмена
						</Button>
						<Button variant="destructive" onClick={handleDeletePrice}>
							Удалить
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}