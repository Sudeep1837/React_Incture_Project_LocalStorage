import { Server } from "socket.io";
import { verifyToken } from "../utils/jwt.js";

const DOMAIN_EVENTS = [
  "project:created",
  "project:updated",
  "task:created",
  "task:updated",
  "task:moved",
  "comment:added",
  "notification:created",
];

export function createSocketServer(httpServer, clientUrl) {
  const io = new Server(httpServer, { cors: { origin: clientUrl, credentials: true } });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) throw new Error("Missing token");
      socket.user = verifyToken(token);
      next();
    } catch (error) {
      next(new Error("Unauthorized socket"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.user.sub}`);
    DOMAIN_EVENTS.forEach((eventName) => {
      socket.on(eventName, (payload) => {
        socket.broadcast.emit(eventName, { ...payload, emittedBy: socket.user.sub });
      });
    });
  });

  return io;
}
