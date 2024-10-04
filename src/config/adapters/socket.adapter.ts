import { Server } from "socket.io";
import http from "http";
import { envs } from "../envs";

export class SocketAdapter {
  private io: Server;

  constructor(httpServer: http.Server) {
    this.io = new Server(httpServer, {
      cors: {
        origin: envs.ORIGIN,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    this.initializeSocketEvents();
  }

  private initializeSocketEvents() {
    this.io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });

      // events
      socket.on("exampleEvent", (msg) => {
        console.log("Message received:", msg);
        this.io.emit("chat message", msg);
      });
    });
  }

  public getIO() {
    return this.io; // Método para acceder a la instancia de Socket.IO
  }
}

// Exportar la instancia global
let socketAdapter: SocketAdapter | null = null;

export const initializeSocketAdapter = (httpServer: http.Server) => {
  if (!socketAdapter) {
    socketAdapter = new SocketAdapter(httpServer);
  }
};

export const getSocketAdapter = () => {
  if (!socketAdapter) {
    throw new Error(
      "SocketAdapter not initialized. Please call initializeSocketAdapter first."
    );
  }
  return socketAdapter;
};
