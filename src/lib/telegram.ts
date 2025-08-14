// lib/telegram.ts
const TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

export async function sendTelegramMessage(
	text: string,
	parseMode: "HTML" | "MarkdownV2" = "HTML"
) {
	if (!TOKEN || !CHAT_ID) throw new Error("Telegram env vars are missing");
	const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		// disable_web_page_preview скрывает превью ссылок, если вдруг будут
		body: JSON.stringify({
			chat_id: CHAT_ID,
			text,
			parse_mode: parseMode,
			disable_web_page_preview: true,
		}),
	});
	console.log(res)
	if (!res.ok) {
		const body = await res.text();
		throw new Error(`Telegram sendMessage failed: ${res.status} ${body}`);
	}
	return res.json();
}

// безопасное экранирование для HTML parse_mode
const esc = (s: string) =>
	String(s)
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");

export async function notifyNewUser(user: {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	currency?: string;
	createdAt?: Date;
}) {
	const created = new Intl.DateTimeFormat("uk-UA", {
		dateStyle: "medium",
		timeStyle: "short",
		timeZone: "Europe/Kyiv",
	}).format(user.createdAt ?? new Date());

	const text = [
		"<b>🆕 Новый пользователь</b>",
		`ID: <code>${esc(user.id)}</code>`,
		`Имя: ${esc(user.firstName)} ${esc(user.lastName)}`,
		`Email: ${esc(user.email)}`,
		`Телефон: ${esc(user.phone)}`,
		user.currency ? `Валюта счёта: ${esc(user.currency)}` : "",
		`Когда: ${esc(created)}`,
	]
		.filter(Boolean)
		.join("\n");

	await sendTelegramMessage(text, "HTML");
}

export async function notifySupportNewMessage(args: {
	message: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
}) {
	const msg =
		args.message.length > 3800
			? args.message.slice(0, 3797) + "…"
			: args.message;

	const text = [
		"<b>✉️ Новое сообщение от пользователя</b>",
		"",
		`<b>Пользователь:</b> ${esc(args.firstName)} ${esc(
			args.lastName || ""
		)}`.trim(),
		args.email ? `Email: ${esc(args.email)}` : "",
		"",
		"<b>Сообщение:</b>",
		esc(msg),
		"",
	]
		.filter(Boolean)
		.join("\n");

	await sendTelegramMessage(text, "HTML");
}
