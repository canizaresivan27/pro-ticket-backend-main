import { whatsapp } from "../../config";

interface MessageParams {
  to: string;
  body: string;
}

export class MessageService {
  constructor() {}

  async sendWhatsappMessage(params: MessageParams) {
    const { to, body } = params;

    try {
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
      await whatsapp.destroy();
      return { message: "Whatsapp disconnected" };
    } catch (error) {
      console.error(error);
      throw new Error(`Internal Server Error`);
    }
  }
}
