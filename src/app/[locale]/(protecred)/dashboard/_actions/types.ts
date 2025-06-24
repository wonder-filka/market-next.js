export type QuoteData = {
	name: string;
	symbol: string;
	history: { time: string; price: number }[];
	price: number;
	change: number;
	sell: number;
	buy: number;
};

