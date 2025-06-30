export type Quote = {
  symbol: string
  name: string
  price: number
  change: number
  buy: number
  sell: number
  history: QuoteHistoryPoint[]
}

export type QuoteHistoryPoint = {
  time: string // формат MM-DD, например "06-30"
  open: number
  close: number
  high: number
  low: number
  price: number
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
