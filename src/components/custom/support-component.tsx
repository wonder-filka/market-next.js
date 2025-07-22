"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Send } from "lucide-react";
import { useI18n } from "@/locales/client";
import { Textarea } from "../ui/textarea";
import { socket } from "@/socket";
import { toast } from "sonner";
import { AdminChatDetail, ChatMessage } from "@/app/[locale]/chat/_actions/types";

interface SupportComponentProps {
	userId: string;
}

export const SupportComponent = ({ userId }: SupportComponentProps) => {
	const t = useI18n();
	const [currentChat, setCurrentChat] = useState<AdminChatDetail | null>(null);
	const [newMessageContent, setNewMessageContent] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [isSending, setIsSending] = useState(false);
	const [hasInitialChatLoaded, setHasInitialChatLoaded] = useState(false);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		if (!socket.connected) {
			socket.connect();
		}

		socket.emit('join-user', userId);

		const onNewMessage = (message: ChatMessage) => {
			setCurrentChat(prevChat => {
				if (!prevChat) return prevChat;
				if (message.chatId !== prevChat.id) return prevChat;
				return {
					...prevChat,
					messages: [...prevChat.messages, message],
				};
			});
		};

		const onChatStatusUpdated = (data: { chatId: string, status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED' }) => {
			if (currentChat && data.chatId === currentChat.id) {
				setCurrentChat(prevChat => {
					if (!prevChat) return prevChat;
					return { ...prevChat, status: data.status };
				});
				if (data.status === 'CLOSED') {
					toast.info(t('support.chatClosedNotification'));
				} else if (data.status === 'IN_PROGRESS') {
					toast.info(t('support.chatInProgressNotification'));
				}
			}
		};

		const onMessagesRead = (data: { chatId: string }) => {
			if (currentChat && data.chatId === currentChat.id) {
				console.log('Socket.IO: Messages marked as read for this chat by other party.');
				setCurrentChat(prevChat => {
					if (!prevChat) return prevChat;
					return {
						...prevChat,
						messages: prevChat.messages.map(msg => ({ ...msg, isRead: true }))
					};
				});
			}
		};

		socket.on('new-message', onNewMessage);
		socket.on('chat-status-updated', onChatStatusUpdated);
		socket.on('messages-read', onMessagesRead);


		return () => {
			socket.emit('leave-user', userId);
			socket.off('new-message', onNewMessage);
			socket.off('chat-status-updated', onChatStatusUpdated);
			socket.off('messages-read', onMessagesRead);
			// socket.disconnect(); // Возможно, не стоит полностью отключаться, если сокет используется в других местах
		};
		// eslint-disable-next-line
	}, [userId, isOpen, currentChat?.id, t]);

	useEffect(() => {
		if (currentChat?.messages && isOpen) {
			scrollToBottom();
		}
	}, [currentChat?.messages, isOpen]);


	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (open) {
			socket.emit('request-user-chat', userId, (chatData: AdminChatDetail) => {
				setCurrentChat(chatData);
				setHasInitialChatLoaded(true);
				setTimeout(scrollToBottom, 100);
			});
			if (currentChat && currentChat.status !== 'CLOSED') {
				socket.emit('join-chat', currentChat.id);
				socket.emit('mark-as-read', { chatId: currentChat.id, userId: userId, isSupport: false });
			}
		} else {
			if (currentChat && currentChat.status !== 'CLOSED') {
				socket.emit('leave-chat', currentChat.id);
			}
		}
	};

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessageContent.trim() || isSending || !currentChat || currentChat.status === 'CLOSED') return;

		setIsSending(true);
		const originalMessageContent = newMessageContent;
		setNewMessageContent("");
		scrollToBottom();

		try {
			socket.emit('send-message', {
				chatId: currentChat.id,
				senderId: userId,
				content: originalMessageContent,
				isSupport: false,
			});

			toast.success(t('support.messageSent'));
		} catch (error) {
			console.error("Ошибка при отправке сообщения:", error);
			setNewMessageContent(originalMessageContent);
			toast.error(t('support.messageSendFailed'));
		} finally {
			setIsSending(false);
		}
	};

	const markReadSent = useRef(false);

	const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNewMessageContent(e.target.value);

		if (
			currentChat &&
			currentChat.status !== 'CLOSED' &&
			!markReadSent.current &&
			currentChat.messages.some(
				msg => msg.senderId !== userId && !msg.isRead
			)
		) {
			socket.emit('mark-as-read', { chatId: currentChat.id, userId: userId, isSupport: false });
			markReadSent.current = true;
		}
	};

	useEffect(() => {
		markReadSent.current = false;
	}, [currentChat?.id, isOpen, currentChat?.messages.length]);

	if (!hasInitialChatLoaded && isOpen) {
		return (
			<Dialog open={isOpen} onOpenChange={handleOpenChange}>
				<DialogTrigger asChild>
					<Button variant="ghost" className="justify-start w-full">
						<Send className="mr-2" />
						{t('sidebar.support')}
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px] flex flex-col h-[630px] left-[20%] top-[60%] translate-x-[-50%] translate-y-[-50%]">
					<DialogHeader>
						<DialogTitle>{t('support.chatTitle')}</DialogTitle>
						<DialogDescription>{t('support.chatDescription')}</DialogDescription>
					</DialogHeader>
					<div className="flex-1 flex items-center justify-center">
						<p className="text-muted-foreground">{t('support.loadingChat')}</p>
					</div>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button variant="ghost" className="justify-start w-full">
					<Send className="mr-2" />
					{t('sidebar.support')}
				</Button>
			</DialogTrigger>
			<DialogContent
				onPointerDownOutside={(e) => e.preventDefault()}
				onEscapeKeyDown={(e) => e.preventDefault()}
				className="sm:max-w-[425px] flex flex-col h-[630px] left-[20%] top-[60%] translate-x-[-50%] translate-y-[-50%]"
			>
				<DialogHeader>
					<DialogTitle>{t('support.chatTitle')}</DialogTitle>
					<DialogDescription>
						{currentChat?.subject || t('support.chatDescription')}
						{currentChat && currentChat.status === 'CLOSED' && (
							<span className="text-red-500 ml-2">({t('support.chatClosed')})</span>
						)}
					</DialogDescription>
				</DialogHeader>
				<div className="flex-1 overflow-hidden">
					<ScrollArea className="h-[400px] pr-4">
						<div className="space-y-4">
							{currentChat && currentChat.messages.length === 0 ? (
								<p className="text-center text-muted-foreground">{t('support.noMessages')}</p>
							) : (
								currentChat?.messages.map((msg) => (
									<div
										key={msg.id}
										className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'
											}`}
									>
										<Card
											className={`p-3 max-w-[70%] ${msg.senderId === userId // Если сообщение от текущего пользователя
												? 'bg-primary text-primary-foreground rounded-br-none'
												: 'bg-muted rounded-bl-none'
												}`}
										>
											<p className="text-sm font-semibold mb-1">
												{msg.senderId === userId ? t('support.you') : msg.sender.firstName}
											</p>
											<p className="text-sm break-all">{msg.content}</p>
											<p className="text-xs break-all text-right opacity-75 mt-1">
												{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
											</p>
										</Card>
									</div>
								))
							)}
							<div ref={messagesEndRef} />
						</div>
					</ScrollArea>
				</div>
				<div className="flex gap-2 p-4 pt-0 items-center">
					{currentChat?.status === 'CLOSED' ? (
						<p className="text-center text-muted-foreground w-full">{t('support.chatClosedMessage')}</p>
					) : (
						<form onSubmit={handleSendMessage} className="flex w-full gap-2">
							<Textarea
								placeholder={t('support.typeMessagePlaceholder')}
								value={newMessageContent}
								onChange={handleTextareaChange}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && !e.shiftKey) {
										e.preventDefault();
										handleSendMessage(e);
									}
								}}
								className="flex-1 h-22 resize-none"
								rows={1}
								disabled={isSending}
							/>
							<Button type="submit" disabled={isSending || !newMessageContent.trim()}>
								<Send className="h-4 w-4" />
								<span className="sr-only">{t('support.sendButton')}</span>
							</Button>
						</form>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};