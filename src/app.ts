import { envs } from "./config/envs";
import { MongoDatabase } from "./data";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

(async () => {
  main();
})();

async function main() {
  await MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL,
  });

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  server.start();
}

/*
import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 3000 });

wss.on("connection", function connection(ws) {
  console.log("Client conneted");

  ws.on("error", console.error);

  ws.on("message", function message(data, isBinary) {
    console.log("Desde el cliente: ", data);
    //enviar data al cliente de regreso
    const payload = JSON.stringify({
      type: "custom-message",
      payload: data.toString(),
    });
    //ws.send(JSON.stringify(payload));

    // Todos incluyente
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload, { binary: false });
      }
    });

    // Todos - excluyente
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(payload, { binary: false });
      }
    });
  });

  //ws.send("Connected from server!");

  ws.on("close", () => {
    {
      console.log("Client Disconnected");
    }
  });
});

console.log("http://localhost:3000");
*/
