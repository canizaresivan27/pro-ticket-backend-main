import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3000 });

wss.on("connection", function connection(ws) {
  console.log("Client conneted");

  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });

  ws.send("Connected from server!");

  setInterval(() => {
    ws.send("Hello again!");
  }, 2000);
});

console.log("http://localhost:3000");
