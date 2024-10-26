import { Client } from "whatsapp-web.js";
import { getSocketAdapter } from "./socket.adapter"; // Ajusta la ruta de socket.adapter según corresponda

let whatsapp: Client | null = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

const initializeWhatsApp = () => {
  console.log("Initializing WhatsApp client...");

  try {
    // Destruir la instancia anterior si existe
    if (whatsapp) {
      whatsapp
        .destroy()
        .catch((err) => console.error("Error destroying instance:", err));
    }

    whatsapp = new Client({
      puppeteer: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });

    whatsapp.on("qr", (qr) => {
      console.log("QR code received for WhatsApp.");
      const socketAdapter = getSocketAdapter();
      socketAdapter.getIO().emit("whatsapp-qr", { status: "linkup", qr });
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
          const body = state === "CONNECTED" ? "Conectado ✅" : "Error ❗";

          socketAdapter.getIO().emit("whatsapp-status", { status: state });
          await whatsapp?.sendMessage(chatId, body);
        } catch (error) {
          console.error(
            "Error while getting WhatsApp state or sending message:",
            error
          );
        }
      }, 1000 * 60 * 5); // Cada 5 minutos
    });

    // Evento cuando se desconecta
    whatsapp.on("disconnected", async (reason) => {
      console.log("WhatsApp client was logged out:", reason);

      const socketAdapter = getSocketAdapter();
      socketAdapter
        .getIO()
        .emit("whatsapp-qr", { status: "disconnected", qr: "" });

      // Destruir la instancia de WhatsApp
      if (whatsapp) {
        try {
          await whatsapp.destroy();
          console.log(
            "WhatsApp instance destroyed successfully after disconnect."
          );
        } catch (err) {
          console.error(
            "Error while destroying WhatsApp instance on disconnect:",
            err
          );
        }
        whatsapp = null;
      }

      reconnect(); // Intentar reconectar después de destruir la instancia
    });

    // Inicializar el cliente
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
    reconnect();
  }
};

const reconnect = () => {
  const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 60000); // Máximo 1 minuto de espera
  reconnectAttempts++;

  if (reconnectAttempts > maxReconnectAttempts) {
    console.error("Max reconnection attempts reached. Stopping retries.");
    return;
  }

  console.log(`Attempting to reconnect... (attempt ${reconnectAttempts})`);

  setTimeout(() => {
    initializeWhatsApp();
  }, delay);
};

// Exportar whatsapp e initWhatsApp
export const initWhatsApp = () => {
  console.log("Starting WhatsApp client initialization...");
  initializeWhatsApp();
};

export const getWhatsAppClient = () => whatsapp;
