import { Client, LocalAuth } from "whatsapp-web.js";
import { getSocketAdapter } from "./socket.adapter";

export const whatsapp = new Client({
  //authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

whatsapp.on("qr", (qr) => {
  const socketAdapter = getSocketAdapter();
  socketAdapter.getIO().emit("whatsapp-qr", { status: "linkup", qr: qr });
  //qrcode.generate(qr, { small: true });
  return qr;
});

whatsapp.on("ready", () => {
  console.log("Client is ready!");
  const socketAdapter = getSocketAdapter();
  socketAdapter.getIO().emit("whatsapp-qr", { status: "connected", qr: "" });

  setInterval(async () => {
    try {
      const state = await whatsapp.getState();
      const phone = "+584249189050";
      const chatId = phone.substring(1) + "@c.us";
      const body = `${state === "CONNECTED" ? "conectado ✅" : "Error❗"}`;
      socketAdapter
        .getIO()
        .emit("whatsapp-qr", { status: "connected", qr: "" });

      await whatsapp.sendMessage(chatId, body);
    } catch (error) {
      console.error(
        "Error while getting WhatsApp state or sending message:",
        error
      );
    }
  }, 1000 * 60 * 5);
});

whatsapp.on("disconnected", (reason) => {
  console.log("Client was logged out:", reason);
  const socketAdapter = getSocketAdapter();
  socketAdapter.getIO().emit("whatsapp-qr", { status: "disconnected", qr: "" });

  setTimeout(() => {
    whatsapp
      .initialize()
      .catch((error) =>
        console.error("Failed to reinitialize WhatsApp client:", error)
      );
  }, 5000);
});
