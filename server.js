// server.js

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { PrismaClient } = require("./src/generated/prisma");
const yahooFinance = require("yahoo-finance2").default;

const app = express();
const httpServer = createServer(app);
const prisma = new PrismaClient();

const symbols = [
	"^NDX",
	"^GSPC",
	"^DJI",
	"BTC-USD",
	"ETH-USD",
	"GC=F",
	"CL=F",
	"COMT",
];

// Налаштування Socket.IO з CORS
const io = new Server(httpServer, {
	cors: {
		origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
		methods: ["GET", "POST"],
		credentials: true,
	},
});

// Зберігаємо підключених адмінів і користувачів
const connectedAdmins = new Map();
const connectedUsers = new Map();

async function getQuotes() {
	const today = new Date();
	const from = new Date();
	from.setDate(today.getDate() - 30);
	try {
		const result = await Promise.all(
			symbols.map(async (symbol) => {
				const history = await yahooFinance.chart(symbol, {
					period1: from.toISOString().split("T")[0],
					period2: today.toISOString().split("T")[0],
					interval: "1d",
				});
				const prices = history.quotes || [];
				const last = prices.at(-1);
				const prev = prices.at(-2);
				const SPREAD = 0.05;
				return {
					symbol,
					name: symbol,
					price: last?.close ?? 0,
					change: (last?.close ?? 0) - (prev?.close ?? 0),
					buy: last?.close ? last.close + SPREAD : 0,
					sell: last.close,
					history: prices.map((d) => ({
						time: new Date(d.date).toISOString().slice(5, 10),
						open: d.open ?? 0,
						close: d.close ?? 0,
						high: d.high ?? 0,
						low: d.low ?? 0,
						price: d.close ?? 0,
					})),
				};
			})
		);

		return result;
	} catch (error) {
		console.log(error);
		return [];
	}
}

setInterval(async () => {
	const quotes = await getQuotes();
	io.emit("quotes-update", quotes);
}, 10 * 1000);

io.on("connection", (socket) => {
	console.log("✅ Користувач підключився:", socket.id);

	// Приєднання користувача до його персональної кімнати
	socket.on("join-user", (userId) => {
		connectedUsers.set(socket.id, userId);
		socket.join(`user-${userId}`);
	});

	// Вихід користувача з персональної кімнати
	socket.on("leave-user", (userId) => {
		console.log(`User ${userId} left personal room`);
		connectedUsers.delete(socket.id);
		socket.leave(`user-${userId}`);
		console.log(`Socket.IO: ${socket.id} left user room: user-${userId}`);
	});

	// Приєднання адміна до кімнати
	socket.on("join-admin", (adminId) => {
		console.log(`Admin ${adminId} joined`);
		connectedAdmins.set(socket.id, adminId);
		socket.join("admins");
	});

	// Приєднання користувача до чату
	socket.on("join-chat", (chatId) => {
		console.log(`User joined chat: ${chatId}`);
		socket.join(`chat-${chatId}`);
	});

	// Вихід з чату
	socket.on("leave-chat", (chatId) => {
		console.log(`User left chat: ${chatId}`);
		socket.leave(`chat-${chatId}`);
	});

	// Відправка нового повідомлення
	socket.on("send-message", async (data) => {
		try {
			const { chatId, senderId, content, isSupport } = data;

			// Зберігаємо повідомлення в БД
			const message = await prisma.supportMessage.create({
				data: {
					chatId,
					senderId,
					content,
					isSupport: isSupport,
				},
				include: {
					sender: {
						select: {
							id: true,
							firstName: true,
							lastName: true,
							email: true,
						},
					},
				},
			});

			// Оновлюємо статус чату
			await prisma.supportChat.update({
				where: { id: chatId },
				data: {
					updatedAt: new Date(),
					status: "IN_PROGRESS",
				},
			});

			// Відправляємо повідомлення в конкретний чат
			io.to(`chat-${chatId}`).emit("new-message", message);
			console.log("Message saved and sent:", message.id);

			// Отправляем уведомление всем админам о новом сообщении
			io.to("admins").emit("chat-updated", {
				chatId,
				lastMessage: {
					content: message.content,
					createdAt: message.createdAt,
					isRead: message.isRead,
					isSupport: message.isSupport,
				},
				status: "IN_PROGRESS",
			});
		} catch (error) {
			console.error("Error saving message:", error);
			socket.emit("error", { message: "Failed to send message" });
		}
	});

	socket.on("request-user-chat", async (userId, callback) => {
		try {
			console.log(`Server: Received request for chat data for user: ${userId}`);

			let chat = await prisma.supportChat.findFirst({
				where: { userId: userId, status: { not: "CLOSED" } },
				include: {
					user: {
						select: { id: true, firstName: true, lastName: true, email: true },
					},
					messages: {
						orderBy: { createdAt: "asc" },
						include: {
							sender: {
								select: {
									id: true,
									firstName: true,
									lastName: true,
									email: true,
								},
							},
						},
					},
				},
			});

			if (!chat) {
				console.log(
					`Server: No active chat found for user ${userId}. Attempting to create a new one.`
				);

				// Проверяем, существует ли пользователь
				const existingUser = await prisma.user.findUnique({
					where: { id: userId },
				});
				if (!existingUser) {
					console.error(
						`Server: User with ID ${userId} not found when trying to create chat.`
					);
					socket.emit("error", {
						message: "User not found for chat creation.",
					});
					return;
				}

				// Создаем новый чат
				chat = await prisma.supportChat.create({
					data: {
						userId: userId,
						subject: "Общая поддержка",
						status: "OPEN",
					},
					include: {
						user: {
							select: {
								id: true,
								firstName: true,
								lastName: true,
								email: true,
							},
						},
						messages: {
							orderBy: { createdAt: "asc" },
							include: {
								sender: {
									select: {
										id: true,
										firstName: true,
										lastName: true,
										email: true,
									},
								},
							},
						},
					},
				});
				console.log(`Server: New chat created with ID: ${chat.id}`);
				// Уведомляем всех админов о новом чате
				io.to("admins").emit("new-chat", chat);
			}

			if (callback) callback(chat);
			console.log(
				`Server: Sent chat data for chat: ${chat.id} to ${socket.id}`
			);

			// Присоединяем к комнате чата
			if (chat && chat.status !== "CLOSED") {
				socket.join(`chat-${chat.id}`);
				console.log(`${socket.id} joined chat room: chat-${chat.id}`);
			}
		} catch (error) {
			console.error("Server Error: Failed to request user chat:", error);
			socket.emit("error", { message: "Failed to load chat data" });
		}
	});

	// Позначити повідомлення як прочитані
	socket.on("mark-as-read", async (data) => {
		try {
			const { chatId, userId, isSupport } = data;

			await prisma.supportMessage.updateMany({
				where: {
					chatId: chatId,
					senderId: { not: userId },
					isRead: false,
					isSupport: !isSupport,
				},
				data: {
					isRead: true,
				},
			});

			// Повідомити про оновлення
			io.to(`chat-${chatId}`).emit("messages-read", { chatId });
		} catch (error) {
			console.error("Error marking messages as read:", error);
		}
	});

	socket.on("close-chat", async (chatId) => {
		try {
			const updatedChat = await prisma.supportChat.update({
				where: { id: chatId },
				data: { status: "CLOSED" },
				include: {
					user: true,
				},
			});

			// Уведомляем всех в чате об изменении статуса
			io.to(`chat-${chatId}`).emit("chat-status-updated", {
				chatId: chatId,
				status: "CLOSED",
			});
			console.log(`Chat ${chatId} status updated to CLOSED.`);

			// Уведомить всех админов об изменении статуса
			io.to("admins").emit("chat-updated", { chatId, status: "CLOSED" });

			// ✅ ИСПРАВЛЕНО: Уведомляем пользователя в его персональной комнате
			io.to(`user-${updatedChat.userId}`).emit("chat-status-updated", {
				chatId: chatId,
				status: "CLOSED",
			});
		} catch (error) {
			console.error("Error closing chat:", error);
			socket.emit("error", { message: "Failed to close chat" });
		}
	});

	socket.on("disconnect", () => {
		console.log("❌ Користувач відключився:", socket.id);
		connectedAdmins.delete(socket.id);
		connectedUsers.delete(socket.id);
	});
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
	console.log(`🚀 Socket.IO сервер запущено на http://localhost:${PORT}`);
});

// Базовий роут для перевірки
app.get("/", (req, res) => {
	res.send("<h1>Socket.IO Support Server працює!</h1>");
});

// Закриття Prisma при завершенні процесу
process.on("beforeExit", async () => {
	await prisma.$disconnect();
});
