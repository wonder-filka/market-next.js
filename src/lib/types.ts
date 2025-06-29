export type QuoteData = {
	name: string;
	symbol: string;
	history: { time: string; price: number }[];
	price: number;
	change: number;
	sell: number;
	buy: number;
};

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
  id: string;
  date: string;         // формат: "YYYY-MM-DD HH:mm"
  asset: string;        // например: "BTC", "ETH"
  type: "Buy" | "Sell"; // можно ограничить возможные значения
  quantity: number;
  price: number;        // цена за единицу
  total: number;        // общая сумма сделки
  status: "Completed" | "Pending" | "Cancelled"; // статус сделки
};

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