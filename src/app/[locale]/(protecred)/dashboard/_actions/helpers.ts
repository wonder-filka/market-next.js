import { UserAsset } from "@/generated/prisma";
import { LiveQuote } from "@/lib/types";
import { Dispatch, SetStateAction } from "react";

export function onQuotesUpdate(
	newQuotes: LiveQuote[],
	userAssets: UserAsset[],
	setLiveQuotes: Dispatch<SetStateAction<LiveQuote[]>>
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
