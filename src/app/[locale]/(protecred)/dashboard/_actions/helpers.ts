
import { LiveQuote } from "@/lib/types";
import { UserAsset } from "../../../../../../prisma/generated/prisma";

export function onQuotesUpdate(
	newQuotes: LiveQuote[],
	userAssets: UserAsset[],
	setLiveQuotes:  (liveQuotes: LiveQuote[]) => void
) {
	// Преобразуем userAssets в Map для быстрого поиска
	const assetMap = new Map(
		userAssets.map((a) => [
			a.asset,
			{ priceBuy: a.priceBuy, priceSell: a.priceSell },
		])
	);

	// Модифицируем newQuotes:
	const mergedQuotes = newQuotes.map((q) => {
		const userAsset = assetMap.get(q.symbol);
		if (!userAsset) return q; // Нет кастомной цены — возвращаем как есть

		// Подменяем только цену последнего дня в history, buy, sell
		const updatedHistory = q.history.map((h, i, arr) =>
			i === arr.length - 1
				? {
						...h,
						price: userAsset.priceSell, // Можно priceBuy если нужно!
						open: userAsset.priceSell,
						close: userAsset.priceSell,
						high: userAsset.priceSell,
						low: userAsset.priceSell,
				  }
				: h
		);

		return {
			...q,
			price: userAsset.priceSell, // Актуальная цена
			buy: userAsset.priceBuy,
			sell: userAsset.priceSell,
			history: updatedHistory,
		};
	});

	setLiveQuotes(mergedQuotes);
}


export function getPercent(q: { price: number; history: { price: number }[] }) {
  const previous = q.history[q.history.length - 2]?.price ?? q.price;
  const current = q.price;
  return previous !== 0 ? ((current - previous) / previous) * 100 : 0;
}