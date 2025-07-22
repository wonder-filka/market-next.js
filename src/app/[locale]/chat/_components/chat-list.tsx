"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { socket } from "@/socket";
import { AdminChat, ChatLastMessage } from "../_actions/types";
import { Button } from "@/components/ui/button";
import { AudioLinesIcon, AudioWaveformIcon, Bell, Volume2 } from "lucide-react";

interface ChatListProps {
  userId: string;
  data: AdminChat[]
}

export function ChatList({ userId, data }: ChatListProps) {
  const [chats, setChats] = useState<AdminChat[]>(data);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    function onNewChat(newChat: AdminChat) {
      setChats(prevChats => {
        const existingChatIndex = prevChats.findIndex(chat => chat.id === newChat.id);
        if (existingChatIndex !== -1) {
          const updatedChats = [...prevChats];
          updatedChats[existingChatIndex] = {
            ...newChat,
            unreadCount: newChat.unreadCount || 0
          };
          return updatedChats.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        }
        const updatedChats = [{ ...newChat, unreadCount: newChat.unreadCount || 0 }, ...prevChats];
        return updatedChats;
      });
    }

    function onChatUpdated(updatedChatData: { chatId: string; lastMessage: ChatLastMessage, status: string }) {
      setChats(prevChats => {
        const updatedChats = prevChats.map(chat =>
          chat.id === updatedChatData.chatId
            ? {
              ...chat,
              lastMessage: updatedChatData.lastMessage,
              updatedAt: new Date(),
              unreadCount: Number(chat.unreadCount) + 1,
              status: updatedChatData.status
            }
            : chat
        ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
        return updatedChats;
      });
    }

    function onMessagesRead(data: { chatId: string }) {
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === data.chatId
            ? { ...chat, unreadCount: 0 }
            : chat
        )
      );
    }

    function onError(err: { message: string }) {
      console.error('Socket.IO error:', err.message);
      setError(`Ошибка Socket.IO: ${err.message}`);
    }

    socket.emit('join-admin', userId);
    socket.on("new-chat", onNewChat);
    socket.on("chat-updated", onChatUpdated);
    socket.on("messages-read", onMessagesRead);
    socket.on("error", onError);

    return () => {
      socket.off("new-chat", onNewChat);
      socket.off("chat-updated", onChatUpdated);
      socket.off("messages-read", onMessagesRead);
      socket.off("error", onError);
      // socket.disconnect(); // Можно отключить сокет при размонтировании, если он больше не нужен
    };
  }, [userId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new window.Audio('notif.mp3');
    }
  }, []);


  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <Card>
      <CardHeader className="flex w-full items-center">
        <CardTitle>Чаты</CardTitle>
        {!audioEnabled &&
          <Button
            onClick={() => setAudioEnabled(true)}
            variant="link"
            className="p-0 m-0 h-4"
          >
            <Volume2 /></Button>}

      </CardHeader>
      <CardContent>
        {chats.length === 0 ? (
          <p className="text-muted-foreground">Нет чатов</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Юзер</TableHead>
                <TableHead>Тема</TableHead>
                <TableHead>Последнее сообщение</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Непрочитанные</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chats.map((chat) => (
                <TableRow key={chat.id}>
                  <TableCell className="font-medium">
                    {chat.user.firstName} {chat.user.lastName}{" "}
                    <span className="text-muted-foreground">({chat.user.email})</span>
                  </TableCell>
                  <TableCell>{chat.subject}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {chat.lastMessage
                      ? chat.lastMessage.content.substring(0, 50) +
                      (chat.lastMessage.content.length > 50 ? "..." : "")
                      : "Нет сообщений"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${chat.status === "open"
                        ? "bg-green-100 text-green-800"
                        : chat.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {chat.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {chat.unreadCount > 0 ? (
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        {chat.unreadCount}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/chat/${chat.id}`} className="text-blue-500 hover:underline text-sm"> {/* Обновите Link, если необходимо */}
                      Смотреть чат
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}