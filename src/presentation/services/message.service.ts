import { getSocketAdapter, getWhatsAppClient } from "../../config";
import { CustomError } from "../../domain";

export class NotificationServices {
  constructor() {}

  async getStatus() {
    try {
      const whatsapp = getWhatsAppClient();
      if (!whatsapp) {
        throw CustomError.internalServer("WhatsApp client is not initialized.");
      }

      const state = await whatsapp.getState();
      let qrCode: string | null = null;

      if (state !== "CONNECTED") {
        qrCode = await new Promise<string | null>((resolve, reject) => {
          const timeout = setTimeout(() => resolve(null), 10000);

          const handleQR = (qr: string) => {
            clearTimeout(timeout);
            resolve(qr);
          };

          const handleAuthFailure = () => {
            clearTimeout(timeout);
            reject(
              new Error(
                "Authentication failure. QR code could not be generated."
              )
            );
          };

          whatsapp.once("qr", handleQR);
          whatsapp.once("auth_failure", handleAuthFailure);
        });
      }

      return { status: state, qrCode };
    } catch (error) {
      console.error("Error fetching status:", error);
      throw new Error("Internal Server Error");
    }
  }

  async disconnectSession() {
    try {
      const whatsapp = getWhatsAppClient();
      if (!whatsapp) {
        throw CustomError.internalServer("WhatsApp client is not initialized.");
      }

      const state = await whatsapp.getState();
      if (state !== "CONNECTED") {
        return {
          message: "WhatsApp is not connected, so no logout was necessary.",
        };
      }

      await whatsapp.logout();
      return { message: "WhatsApp disconnected successfully" };
    } catch (error) {
      console.error("Error during WhatsApp logout:", error);
      throw new Error("Internal Server Error");
    }
  }
  /*
  async sendWhatsappMessage(params: MessageParams) {
    const { to, body } = params;

    try {
      const whatsapp = getWhatsAppClient();
      if (!whatsapp) {
        throw CustomError.internalServer("WhatsApp client is not initialized.");
      }

      const phone = to;
      const chatId = phone.substring(1) + "@c.us";
      const number_details = await whatsapp.getNumberId(chatId);

      if (number_details) {
        await whatsapp.sendMessage(chatId, body);
      } else {
        throw new Error("Number not found");
      }
      return { message: "Message sent" };
    } catch (error) {
      throw new Error(`Internal Server Error`);
    }
  }

  async getWhatsappStatus() {
    try {
      const whatsapp = getWhatsAppClient();
      if (!whatsapp) {
        throw CustomError.internalServer("WhatsApp client is not initialized.");
      }
      const state = await whatsapp.getState();
      whatsapp.on("qr", (qr) => {
        return { qr: qr, status: state };
      });
    } catch (error) {
      console.error(error);
      throw new Error(`Internal Server Error`);
    }
  }

  async disconnectWhatsapp() {
    try {
      const whatsapp = getWhatsAppClient();
      if (!whatsapp) {
        throw CustomError.internalServer("WhatsApp client is not initialized.");
      }
      await whatsapp.destroy();
      return { message: "Whatsapp disconnected" };
    } catch (error) {
      console.error(error);
      throw new Error(`Internal Server Error`);
    }
  }*/
}
