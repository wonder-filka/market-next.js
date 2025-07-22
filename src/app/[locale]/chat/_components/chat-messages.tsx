'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { socket } from "@/socket";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { AdminChatDetail, ChatMessage } from "../_actions/types";

interface ChatMessagesProps {
    chatId: string;
    currentUserId: string;
    data: AdminChatDetail | null
}

export function ChatMessages({ chatId, currentUserId, data }: ChatMessagesProps) {
    const router = useRouter();
    const [chat, setChat] = useState<AdminChatDetail | null>(data);
    const [newMessageContent, setNewMessageContent] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!chatId) return;
        if (!socket.connected) {
            socket.connect();
        }

        socket.emit('join-chat', chatId);
        socket.emit('join-admin', currentUserId);
        socket.emit('mark-as-read', { chatId: chatId, userId: currentUserId, isSupport: true });

        const onNewMessage = (message: ChatMessage) => {
            setChat(prevChat => {
                if (!prevChat) return prevChat;
                if (message.chatId !== prevChat.id) return prevChat;
                return {
                    ...prevChat,
                    messages: [...prevChat.messages, message],
                };
            });
        };

        const onMessagesRead = (data: { chatId: string }) => {
            if (chat && data.chatId === chat.id) {
                setChat(prevChat => {
                    if (!prevChat) return prevChat;
                    return {
                        ...prevChat,
                        messages: prevChat.messages.map(msg => ({ ...msg, isRead: true }))
                    };
                });
            }
        };

        const onChatStatusUpdated = (data: { chatId: string, status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED' }) => {
            if (chat && data.chatId === chat.id) {
                setChat(prevChat => {
                    if (!prevChat) return prevChat;
                    return {
                        ...prevChat,
                        status: data.status,
                    };
                });
                if (data.status === 'CLOSED') {
                    toast.success("Чат был закрыт.");
                }
            }
        };

        socket.on('new-message', onNewMessage);
        socket.on('messages-read', onMessagesRead);
        socket.on('chat-status-updated', onChatStatusUpdated);

        return () => {
            if (chatId) {
                console.log(`Socket.IO: Leaving chat room: chat-${chatId}`);
                socket.emit('leave-chat', chatId);
                socket.off('new-message', onNewMessage);
                socket.off('messages-read', onMessagesRead);
                socket.off('chat-status-updated', onChatStatusUpdated);
            }
        };
        // eslint-disable-next-line
    }, [chatId, currentUserId]);

    useEffect(() => {
        if (chat?.messages) {
            scrollToBottom();
        }
    }, [chat?.messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessageContent.trim() || isSending || !chat) return;

        setIsSending(true);
        const originalMessageContent = newMessageContent;
        setNewMessageContent("");

        const tempMessage: ChatMessage = {
            id: `temp-${Date.now()}`,
            chatId: chat.id,
            senderId: currentUserId,
            content: originalMessageContent,
            isSupport: true,
            isRead: false,
            createdAt: new Date().toISOString(),
            sender: {
                id: currentUserId,
                firstName: "Вы",
                lastName: "",
                email: "",
            }
        };
        scrollToBottom();

        try {
            socket.emit('send-message', {
                chatId: chat.id,
                senderId: currentUserId,
                content: originalMessageContent,
                isSupport: true,
            });
            toast.success("Сообщение отправлено!");
        } catch (error) {
            console.error("Ошибка при отправке сообщения:", error);
            setChat(prevChat => {
                if (!prevChat) return prevChat;
                return {
                    ...prevChat,
                    messages: prevChat.messages.filter(msg => msg.id !== tempMessage.id),
                };
            });
            setNewMessageContent(originalMessageContent);
            toast.error("Не удалось отправить сообщение.");
        } finally {
            setIsSending(false);
        }
    };

    const handleCloseChat = async () => {
        if (!chat || !chat.id) return;
        if (!window.confirm("Вы уверены, что хотите закрыть этот чат?")) return;

        try {
            socket.emit('close-chat', chat.id);
            setChat(prevChat => {
                if (!prevChat) return prevChat;
                return { ...prevChat, status: 'CLOSED' };
            });
            toast.success("Чат закрыт!");
            router.push("/chat");
        } catch (error) {
            console.error("Ошибка при закрытии чата:", error);
            toast.error("Не удалось закрыть чат.");
        }
    };

    const isCurrentUserSender = (senderId: string) => senderId === currentUserId;

    if (!chat) {
        return (
            <Card className="flex items-center justify-center p-8 text-muted-foreground h-[90vh] max-w-3xl mx-auto">
                <CardContent>Загрузка чата...</CardContent>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col h-[90vh] w-3xl mx-auto">
            <CardHeader className="border-b flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Пользователь: {chat.user.firstName} {chat.user.lastName}</CardTitle>
                    <p className="text-sm text-muted-foreground">Имеил: {chat.user.email}</p>
                    <p className="text-sm text-muted-foreground">Тема: {chat.subject}</p>
                </div>
                <Button
                    variant="outline"
                    onClick={handleCloseChat}
                    disabled={chat.status === 'CLOSED'}
                >
                    {chat.status === 'CLOSED' ? "Чат закрыт" : "Закрыть чат"}
                </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {chat.messages.length === 0 ? (
                    <p className="text-center text-muted-foreground">Нет сообщений</p>
                ) : (
                    chat.messages.map((msg) => (
                        <div key={msg.id} className={`flex ${isCurrentUserSender(msg.sender.id) ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-3 rounded-lg ${msg.isSupport ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                <p className="text-xs font-semibold mb-1">
                                    {msg.isSupport ? "Админ" : `${msg.sender.firstName} ${msg.sender.lastName}`}
                                </p>
                                <p>{msg.content}</p>
                                <p className="text-xs text-right mt-1 opacity-75">
                                    {format(new Date(msg.createdAt), "HH:mm, dd.MM.yyyy", { locale: ru })}
                                </p>
                                {msg.isSupport && msg.isRead && (
                                    <span className="text-green-500 text-xs ml-2">✓ Прочитано</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </CardContent>
            <CardFooter className="border-t p-4">
                {chat.status === 'CLOSED' ? (
                    <p className="text-center text-muted-foreground w-full">Чат закрыт</p>
                ) : (
                    <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                        <Textarea
                            value={newMessageContent}
                            onChange={(e) => setNewMessageContent(e.target.value)}
                            placeholder="Введите ваше сообщение..."
                            className="flex-1 resize-none"
                            rows={1}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                            disabled={isSending}
                        />
                        <Button type="submit" disabled={isSending || !newMessageContent.trim()}>
                            <Send size={20} />
                            <span className="sr-only">Отправить</span>
                        </Button>
                    </form>
                )}
            </CardFooter>
        </Card>
    );
}