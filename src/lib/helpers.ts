
export function normalizePhone(phone: string): string {
	return phone.replace(/\D/g, "");
}

export function formatCurrency(amount: number) {
  return  amount.toLocaleString(undefined, { minimumFractionDigits: 2 });
}

