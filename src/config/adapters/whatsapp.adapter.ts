import { Client } from "whatsapp-web.js";
import { getSocketAdapter } from "./socket.adapter"; // Ajusta la ruta de socket.adapter según corresponda

let whatsapp: Client | null = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

const initializeWhatsApp = () => {
  console.log("Initializing WhatsApp client...");

  try {
    whatsapp = new Client({
      puppeteer: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });

    whatsapp.on("qr", (qr) => {
      console.log("QR code received for WhatsApp.");
      const socketAdapter = getSocketAdapter();
      socketAdapter.getIO().emit("whatsapp-qr", { status: "linkup", qr: qr });
    });

    whatsapp.on("ready", () => {
      console.log("WhatsApp client is ready!");
      const socketAdapter = getSocketAdapter();
      socketAdapter
        .getIO()
        .emit("whatsapp-qr", { status: "connected", qr: "" });

      setInterval(async () => {
        try {
          const state = await whatsapp?.getState();
          const phone = "+584249189050";
          const chatId = phone.substring(1) + "@c.us";
          const body = `${state === "CONNECTED" ? "conectado ✅" : "Error❗"}`;
          socketAdapter
            .getIO()
            .emit("whatsapp-qr", { status: "connected", qr: "" });

          await whatsapp?.sendMessage(chatId, body);
        } catch (error) {
          console.error(
            "Error while getting WhatsApp state or sending message:",
            error
          );
        }
      }, 1000 * 60 * 5); // 5 minutos
    });

    whatsapp.on("disconnected", (reason) => {
      console.log("WhatsApp client was logged out:", reason);
      const socketAdapter = getSocketAdapter();
      socketAdapter
        .getIO()
        .emit("whatsapp-qr", { status: "disconnected", qr: "" });

      reconnect();
    });

    whatsapp
      .initialize()
      .then(() => {
        console.log("WhatsApp client initialized successfully.");
      })
      .catch((error) => {
        console.error("Failed to initialize WhatsApp:", error);
        reconnect();
      });
  } catch (error) {
    console.error("Error during WhatsApp initialization:", error);
  }
};

const reconnect = () => {
  const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 60000); // Máximo 1 minuto de espera
  console.log(`Attempting to reconnect... (attempt ${reconnectAttempts + 1})`);

  setTimeout(async () => {
    try {
      reconnectAttempts += 1;

      if (whatsapp) {
        console.log("Destroying existing WhatsApp instance...");
        await whatsapp.destroy();
      }

      console.log("Reinitializing WhatsApp...");
      initializeWhatsApp();
      reconnectAttempts = 0; // Reset attempts on success
    } catch (error) {
      console.error("Reconnection failed:", error);
      if (reconnectAttempts < maxReconnectAttempts) {
        reconnect();
      } else {
        console.error("Max reconnection attempts reached. Stopping retries.");
      }
    }
  }, delay);
};

// Exportar whatsapp e initWhatsApp
export const initWhatsApp = () => {
  console.log("Starting WhatsApp client initialization...");
  initializeWhatsApp();
};

export const getWhatsAppClient = () => whatsapp;
