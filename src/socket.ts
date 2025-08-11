"use client";

import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_NEST_API_BASE!, {
  autoConnect: true,
  reconnection: true,
  timeout: 20000,
  forceNew: true,
  transports: ["websocket"]
});