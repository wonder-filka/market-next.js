
export function normalizePhone(phone: string): string {
	return phone.replace(/\D/g, "");
}

export function formatCurrency(amount: number) {
  return  amount.toLocaleString(undefined, { minimumFractionDigits: 2 });
}

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  RUB: "₽",
  GBP: "£",
};

export function getCurrencySymbol(code: string): string {
  return currencySymbols[code] ?? code;
}