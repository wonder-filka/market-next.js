'use client'

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
	Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useReactTable, getCoreRowModel, ColumnDef, flexRender, ColumnFiltersState, getFilteredRowModel } from "@tanstack/react-table"
import { User, CryptoWallet } from "../../../../../prisma/generated/prisma"

type CryptoWalletWithUser = CryptoWallet & {
	User: (User) | null;
};

export const CryptoWalletsTable = ({ wallets }: { wallets: CryptoWalletWithUser[] }) => {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [globalFilter, setGlobalFilter] = useState('')


	const columns: ColumnDef<CryptoWalletWithUser>[] = [
		{
			accessorKey: "user",
			header: () => "Пользователь",
			cell: ({ row }) =>
				row.original.User
					? `${row.original.User.firstName} ${row.original.User.lastName} (${row.original.User.email})`
					: "—",
			enableGlobalFilter: true,
			accessorFn: row =>
				row.User ? `${row.User.firstName} ${row.User.lastName} ${row.User.email}` : "",
		},
		{
			accessorKey: "currency",
			header: () => "currency",
			cell: ({ row }) => row.original.currency,
		},
			{
			accessorKey: "chain",
			header: () => "chain",
			cell: ({ row }) => row.original.chain,
		},
		{
			accessorKey: "address",
			header: () => "address",
			cell: ({ row }) => row.original.address,
		},
		{
			id: "mnemonic",
			header: () => "mnemonic",
			cell: ({ row }) => row.original.mnemonic,
		},
		{
			accessorKey: "privateKey",
			header: () => "privateKey",
			cell: ({ row }) => row.original.privateKey,
		},
	]

	const table = useReactTable({
		data: wallets,
		columns,
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
			</CardContent>
		</Card>
	)
}
