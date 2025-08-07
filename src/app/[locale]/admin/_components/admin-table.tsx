'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { createOrUpdateUserAsset, deleteUserAsset } from "../_actions"
import { toast } from "sonner"
import { PositionWithRelations } from "../_actions/types"
import { useReactTable, getCoreRowModel, ColumnDef, flexRender, ColumnFiltersState, getFilteredRowModel } from "@tanstack/react-table"
import { format } from "date-fns"
import { quoteNames } from "@/lib/constants"
import { socket } from "@/socket"
import { onQuotesUpdate } from "../../(protecred)/dashboard/_actions/helpers"
import { LiveQuote } from "@/lib/types"
import { useQuotesStore } from "@/stores/quotes-store"
import { LoaderCircle } from "lucide-react"
import { UserAsset } from "../../../../../prisma/generated/prisma"

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
	const { liveQuotes, setLiveQuotes } = useQuotesStore()

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

	const columns: ColumnDef<PositionWithRelations>[] = [
		{
			accessorKey: "userName",
			header: () => "Имя поль-ля",
			cell: ({ row }) =>
				`${row.original.user.firstName} ${row.original.user.lastName}`,
			enableGlobalFilter: true,
			accessorFn: row => `${row.user.firstName} ${row.user.lastName}`,
		},
		{
			accessorKey: "userEmail",
			header: () => "Имеил поль-ля",
			cell: ({ row }) => row.original.user.email,
			enableGlobalFilter: true,
			accessorFn: row => row.user.email,
		},
		{
			accessorKey: "mt5Id",
			header: () => "Номер кошел.",
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
			header: () => "Кол-во",
			cell: ({ row }) => {
				return (
					<span className="max-w-[20px]">
						{row.original.quantity}
					</span>
				)

			}
		},
		{
			accessorKey: "entry",
			header: () => "Цена входа",
			cell: ({ row }) => row.original.entry,
		},
		{
			accessorKey: "tableTradeSumm",
			header: () => "Сумма сделки",
			cell: ({ row }) => row.original.quantity * row.original.entry,
		},
		{
			accessorKey: "currentSell",
			header: () => "Цена прод.",
			cell: ({ row }) => {
				const pos = row.original;
				const userSellPrice = getUserAssetPrice(pos.asset, pos.userId, userAssets, "Sell");
				const apiSellPrice = liveQuotes.find(q => q.symbol === pos.asset)?.sell ?? 0;
				const manual = userSellPrice !== null && userSellPrice !== undefined;
				const show = manual ? userSellPrice : apiSellPrice;
				return (
					<span className={manual ? "text-blue-600 font-semibold" : ""}>
						{show}
					</span>
				);
			},
		},
		{
			accessorKey: "currentBuy",
			header: () => "Цена покуп.",
			cell: ({ row }) => {
				const pos = row.original;
				const userBuyPrice = getUserAssetPrice(pos.asset, pos.userId, userAssets, "Buy");
				const apiBuyPrice = liveQuotes.find(q => q.symbol === pos.asset)?.buy ?? 0;
				const manual = userBuyPrice !== null && userBuyPrice !== undefined;
				const show = manual ? userBuyPrice : apiBuyPrice;
				return (
					<span className={manual ? "text-blue-600 font-semibold" : ""}>
						{show}
					</span>
				);
			},
		},
		{
			id: "priceSource",
			header: () => "Источник цены",
			cell: ({ row }) => {
				const pos = row.original;
				const userBuyPrice = getUserAssetPrice(pos.asset, pos.userId, userAssets, "Buy");
				const userSellPrice = getUserAssetPrice(pos.asset, pos.userId, userAssets, "Sell");
				const manual = (userBuyPrice !== null && userBuyPrice !== undefined) || (userSellPrice !== null && userSellPrice !== undefined);
				return manual
					? <span className="text-blue-600">🖐 Ручная</span>
					: <span className="text-gray-500">🌐 API</span>;
			}
		},
		{
			accessorKey: "pnl",
			header: () => "Доход",
			cell: ({ row }) => {
				const pos = row.original;
				const userBuy = getUserAssetPrice(pos.asset, pos.userId, userAssets, "Buy");
				const userSell = getUserAssetPrice(pos.asset, pos.userId, userAssets, "Sell");
				// Получаем значения buy/sell из quotes для этого актива (нужно передать buyMap, sellMap в компонент)
				const sell = liveQuotes.find(q => q.symbol === pos.asset)?.sell ?? 0;
				const buy = liveQuotes.find(q => q.symbol === pos.asset)?.buy ?? 0;


				let currentPrice: number;
				if (pos.type === "Buy") {
					currentPrice = userBuy !== null ? userBuy : buy;
				} else {
					currentPrice = userSell !== null ? userSell : sell;
				}
				const pnl = pos.type === "Buy"
					? (currentPrice - pos.entry) * pos.quantity
					: (pos.entry - currentPrice) * pos.quantity;
				return (
					<span className={pnl >= 0 ? "text-green-600" : "text-red-600"}>
						{pnl.toFixed(8)}
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
		} catch (error: unknown) {
			console.error("Error updating price:", error);
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
		} catch (error: unknown) {
			console.error("Error deleting price:", error);
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
					return <Button
							variant="link"
							onClick={() => handleOpenDialog(item)}
						>
							Редакт.
						</Button>
				},
			},
			{
				id: "deletePrice",
				header: () => "Удалить цену",
				cell: ({ row }) => {
					const pos = row.original;
					return <Button
							variant="link"
							size="sm"
							className="text-red-500"
							onClick={() => openDeleteDialog(pos.userId, pos.asset)}
						>
							Удалить
						</Button>
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

	if (liveQuotes.length === 0) {
		return <div className='w-full min-h-[90vh] flex justify-center items-center space-x-2'>
			<LoaderCircle size={25} className='text-gray-500 animate-spin' />
		</div>
	}
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
					<Table className="">
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