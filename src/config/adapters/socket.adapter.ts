import { Server } from "socket.io";
import http from "http";
import { envs } from "../envs";

export class SocketAdapter {
  private io: Server;

  constructor(httpServer: http.Server) {
    this.io = new Server(httpServer, {
      cors: {
        origin: [envs.ORIGIN, "http://localhost:5173", "http://localhost:80"],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    this.initializeSocketEvents();
  }

  private initializeSocketEvents() {
    this.io.on("connection", (socket) => {
      console.log("[server] New client connected:", socket.id);

      // EVENTS
      //room
      socket.on("joinProjectRoom", ({ projectId }) => {
        if (projectId) {
          socket.join(projectId);
          console.log(
            `[server] Socket[${socket.id}] se unió a la sala: ${projectId}`
          );
        }
      });

      socket.on("disconnect", () => {
        console.log("[server] Client disconnected:", socket.id);
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
