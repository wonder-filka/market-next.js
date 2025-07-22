export interface ChatUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Для поля lastMessage
export interface ChatLastMessage {
  content: string;
  createdAt: Date;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

// Основной интерфейс чата для админки
export interface AdminChat {
  id: string;
  userId: string;
  subject: string;
  status: string; // 'open' | 'in_progress' | 'closed' (если хочется, можешь заменить на enum)
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date | null;
  user: ChatUser;
  lastMessage: ChatLastMessage | null;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  isSupport: boolean;
  isRead: boolean;
  createdAt: string; // Или Date, но чаще string для API
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
}

export interface AdminChatDetail {
  id: string;
  userId: string;
  subject: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  messages: ChatMessage[];
}