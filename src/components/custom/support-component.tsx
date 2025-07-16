// components/support-component.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card"; // Опционально, для стилизации сообщений
import { Send } from "lucide-react";
import { useI18n } from "@/locales/client"; // Предполагается, что у вас есть этот хук для интернационализации
import { Textarea } from "../ui/textarea";

interface Message {
	id: string;
	sender: "user" | "support";
	text: string;
	timestamp: Date;
}

interface SupportComponentProps {
	userId: string;
}

export const SupportComponent = ({ userId }: SupportComponentProps) => {
	const t = useI18n(); // Для перевода текста
	const [messages, setMessages] = useState<Message[]>([]); // Сообщения чата
	const [inputMessage, setInputMessage] = useState(""); // Текст в поле ввода
	const [isOpen, setIsOpen] = useState(false); // Состояние открытия/закрытия диалога

	const handleSendMessage = () => {
		if (inputMessage.trim() === "") return;

		const newMessage: Message = {
			id: Date.now().toString(),
			sender: "user",
			text: inputMessage,
			timestamp: new Date(),
		};
		setMessages((prevMessages) => [...prevMessages, newMessage]);
		setInputMessage(""); // Очищаем поле ввода
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				{/* Кнопка "Поддержка" в вашей Sidebar */}
				<Button variant="ghost" className="justify-start w-full">
					<Send className="mr-2" />
					{t('sidebar.support')} {/* Используем ваш хук для перевода */}
				</Button>
			</DialogTrigger>
			<DialogContent
				onPointerDownOutside={(e) => e.preventDefault()}
				onEscapeKeyDown={(e) => e.preventDefault()}
				className="sm:max-w-[425px] flex flex-col h-[630px] left-[20%] top-[60%] translate-x-[-50%] translate-y-[-50%]">
				<DialogHeader>
					<DialogTitle>{t('support.chatTitle')}</DialogTitle>
					<DialogDescription>{t('support.chatDescription')}</DialogDescription>
				</DialogHeader>
				<div className="flex-1 ">
					<ScrollArea className="pr-4 overflow-y-scroll h-[400px]"> 
						<div className="space-y-4">
							{messages.length === 0 && (
								<p className="text-center text-muted-foreground">{t('support.noMessages')}</p>
							)}
							{messages.map((msg) => (
								<div
									key={msg.id}
									className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'
										}`}
								>
									<Card
										className={`p-3 max-w-[70%] ${msg.sender === 'user'
											? 'bg-primary text-primary-foreground rounded-br-none'
											: 'bg-muted rounded-bl-none'
											}`}
									>
										<p className="text-sm  break-all">{msg.text}</p>
										<p className="text-xs break-all text-right text- opacity-75 mt-1">
											{msg.timestamp.toLocaleTimeString()}
										</p>
									</Card>
								</div>
							))}
						</div>
					</ScrollArea>
				</div>
				<div className="flex gap-2 p-4 pt-0 border-t items-center"> {/* Добавляем границу сверху */}
					<Textarea
						placeholder={t('support.typeMessagePlaceholder')}
						value={inputMessage}
						onChange={(e) => setInputMessage(e.target.value)}
						onKeyPress={(e) => {
							if (e.key === 'Enter') {
								handleSendMessage();
							}
						}}
						className="flex-1 h-22 resize-none"
					/>
					<Button onClick={handleSendMessage} disabled={inputMessage.trim() === ''}>
						<Send className="h-4 w-4" />
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
