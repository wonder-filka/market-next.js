export type QuoteHistoryPoint = {
  time: string
  price: number
  open?: number
  close?: number
  high?: number
  low?: number
}

export type Quote = {
  symbol: string
  name: string
  price: number
  change: number
  buy: number
  sell: number
  history: QuoteHistoryPoint[]
}

export type Trade = {
  id: string
  startDate: string
  endDate: string
  asset: string
  type: "Buy" | "Sell"
  quantity: number
  price: number
  total: number
  status: "Completed" | "Pending" | "Cancelled"
}


export type UpdateUserBasicSettingsInput = {
	id: string
	firstName: string
	lastName: string
	email: string
	phone: string
}

export type UserBasicSettingsInput = {
	firstName: string
	lastName: string
	email: string
	phone: string
}
