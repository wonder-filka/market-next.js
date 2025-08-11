'use client'

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
	Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useReactTable, getCoreRowModel, ColumnDef, flexRender, ColumnFiltersState, getFilteredRowModel } from "@tanstack/react-table"
import { format } from "date-fns"
import { Wallet, User, Account } from "../../../../../prisma/generated/prisma"
import { Button } from "@/components/ui/button"
import { TopUpWalletDialog } from "./top-up-wallet-dialog"
import { AccountsDialog } from "./accounts-dialog"

type WalletWithUserAndAccounts = Wallet & {
	user: (User & { accounts: Account[] }) | null;
};

export const WalletsTable = ({ wallets, safeRates }: { wallets: WalletWithUserAndAccounts[], safeRates: Record<string, number>; }) => {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [globalFilter, setGlobalFilter] = useState('')
	const [topUpDialogOpen, setTopUpDialogOpen] = useState(false)
	const [selectedWallet, setSelectedWallet] = useState<WalletWithUserAndAccounts | null>(null)
	const [accountsDialogOpen, setAccountsDialogOpen] = useState(false);

	const columns: ColumnDef<WalletWithUserAndAccounts>[] = [
		{
			accessorKey: "user",
			header: () => "Пользователь",
			cell: ({ row }) =>
				row.original.user
					? `${row.original.user.firstName} ${row.original.user.lastName} (${row.original.user.email})`
					: "—",
			enableGlobalFilter: true,
			accessorFn: row =>
				row.user ? `${row.user.firstName} ${row.user.lastName} ${row.user.email}` : "",
		},
		{
			accessorKey: "balance",
			header: () => "Баланс",
			cell: ({ row }) => row.original.balance.toFixed(2),
		},
		{
			accessorKey: "withdrawn",
			header: () => "Сумма вывода на акк",
			cell: ({ row }) => row.original.withdrawn.toFixed(2),
		},
		{
			id: "freeMargin",
			header: () => "Free Margin",
			cell: ({ row }) => (row.original.balance - row.original.withdrawn).toFixed(2),
		},
		{
			accessorKey: "createdAt",
			header: () => "Создан",
			cell: ({ row }) => format(new Date(row.original.createdAt), "dd.MM.yyyy, HH:mm"),
			accessorFn: row => new Date(row.createdAt).toLocaleString(),
			enableGlobalFilter: false,
		},
		{
			accessorKey: "updatedAt",
			header: () => "Обновлён",
			cell: ({ row }) => format(new Date(row.original.updatedAt), "dd.MM.yyyy, HH:mm"),
			accessorFn: row => new Date(row.updatedAt).toLocaleString(),
			enableGlobalFilter: false,
		},
	]

	const table = useReactTable({
		data: wallets,
		columns: [
			...columns,
			{
				id: "edit",
				header: () => null,
				cell: ({ row }) => {
					return <Button
						variant="link"
						onClick={() => {
							setSelectedWallet(row.original)
							setTopUpDialogOpen(true)
						}}
					>
						Пополнить
					</Button>
				},
			},
			{
				id: "openAcccounts",
				header: () => null,
				cell: ({ row }) => {
					return <Button
						variant="default"
						onClick={() => {
							setSelectedWallet(row.original);
							setAccountsDialogOpen(true);
						}}
					>
						Посмотреть аккаунты
					</Button>
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
		<Card>
			<CardContent>
				<div className='flex items-center justify-between py-4'>
					<Input
						placeholder='Поиск по ID, имени или email...'
						className='md:max-w-sm'
						value={globalFilter}
						onChange={e => setGlobalFilter(e.currentTarget.value)}
					/>
				</div>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => (
									<TableHead key={header.id}>
										{flexRender(header.column.columnDef.header, header.getContext())}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.map(row => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map(cell => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
				{
					selectedWallet &&
					<>
						<TopUpWalletDialog
							open={topUpDialogOpen}
							onOpenChange={setTopUpDialogOpen}
							wallet={selectedWallet}
						/>
						<AccountsDialog
							open={accountsDialogOpen}
							onOpenChange={setAccountsDialogOpen}
							wallet={selectedWallet}
							safeRates={safeRates}
						/>
					</>
				}

			</CardContent>
		</Card>
	)
}
