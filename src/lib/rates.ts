import yahooFinance from "yahoo-finance2";

export async function getRates() {
	const currencies = ["USD", "EUR", "GBP", "RUB"];
	const pairs = currencies.filter((c) => c !== "USD").map((c) => `USD${c}=X`);

	if (!pairs.length) return {};

	const quotes = await yahooFinance.quote(pairs);      // всё ок
	yahooFinance.suppressNotices(["yahooSurvey"]);
	const list = Array.isArray(quotes) ? quotes : [quotes];

	return Object.fromEntries(
		list.map((q) => [
			q.symbol.replace("USD", "").replace("=X", ""), // EUR, GBP …
			q.regularMarketPrice, // курс
		])
	);
}
