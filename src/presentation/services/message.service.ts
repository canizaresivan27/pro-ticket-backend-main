import twilio, { Twilio } from "twilio";
import { whatsapp } from "../../config";

interface MessageParams {
  to: string;
  body: string;
}

export class MessageService {
  private client: Twilio;

  constructor(accountSid: string, authToken: string) {
    this.client = twilio(accountSid, authToken);
  }

  async sendWhatsapp(params: MessageParams): Promise<boolean> {
    const { to, body } = params;

    try {
      const message = await this.client.messages.create({
        body: body,
        from: "whatsapp:+14155238886", // Twilio Number
        to: `whatsapp:${to}`,
      });

      //console.log(`Message: ${to} ${body}`);
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    }
  }

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
}
