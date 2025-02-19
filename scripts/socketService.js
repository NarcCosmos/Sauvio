import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000"; // Socket URL/IP Address

const socket = io(SOCKET_URL, {
  transports: ["websocket"], // More compatible with React Native
  forceNew: true,
});

export {socket};