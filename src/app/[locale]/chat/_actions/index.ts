"use server";

import { prisma } from "@/lib/db";
import { AdminChat, AdminChatDetail } from "./types";

export const getChatsAdmin = async (): Promise<AdminChat[]> => {
	try {
		const chats = await prisma.supportChat.findMany({
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
					orderBy: { createdAt: "desc" },
					take: 1,
					include: {
						sender: {
							select: {
								id: true,
								firstName: true,
								lastName: true,
							},
						},
					},
				},
				_count: {
					select: {
						messages: {
							where: {
								isSupport: false, // Повідомлення від користувачів
								isRead: false, // Які ще не прочитані
							},
						},
					},
				},
			},
			orderBy: {
				updatedAt: "desc",
			},
		});
		const formattedChats = chats.map((chat) => ({
			id: chat.id,
			userId: chat.userId,
			subject: chat.subject,
			status: chat.status.toLowerCase(),
			createdAt: chat.createdAt,
			updatedAt: chat.updatedAt,
			closedAt: chat.closedAt,
			user: chat.user,
			lastMessage: chat.messages[0]
				? {
						content: chat.messages[0].content,
						createdAt: chat.messages[0].createdAt,
						sender: chat.messages[0].sender,
				  }
				: null,
			unreadCount: chat._count.messages,
		}));
		return formattedChats;
	} catch (error) {
		console.log(error)
		return []
	}
};

export const getChatAdminById = async (chatId: string): Promise<AdminChatDetail | null> => {
  try {
    const chatData = await prisma.supportChat.findUnique({
      where: { id: chatId },
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

    if (!chatData) return null;

    // Форматируем сообщения и даты, если нужно
    const formattedMessages = chatData.messages.map((msg) => ({
      ...msg,
      createdAt: msg.createdAt instanceof Date ? msg.createdAt.toISOString() : msg.createdAt,
      sender: msg.sender,
    }));

    const chatDetail: AdminChatDetail = {
      id: chatData.id,
      userId: chatData.userId,
      subject: chatData.subject,
      status: chatData.status.toLowerCase(),
      createdAt: chatData.createdAt instanceof Date ? chatData.createdAt.toISOString() : chatData.createdAt,
      updatedAt: chatData.updatedAt instanceof Date ? chatData.updatedAt.toISOString() : chatData.updatedAt,
      closedAt: chatData.closedAt ? (chatData.closedAt instanceof Date ? chatData.closedAt.toISOString() : chatData.closedAt) : null,
      user: chatData.user,
      messages: formattedMessages,
    };

    return chatDetail;
  } catch (error) {
    console.error(error);
    return null;
  }
};