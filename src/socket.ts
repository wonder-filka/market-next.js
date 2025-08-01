"use client";

import { io } from "socket.io-client";

export const socket = io("http://localhost:3001", {
  autoConnect: true,
  reconnection: true,
  timeout: 20000,
  forceNew: true,
  transports: ["websocket"]
});