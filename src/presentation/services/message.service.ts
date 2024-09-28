import twilio, { Twilio } from "twilio";
import { whatsapp } from "../../config";

interface WhatsappMessageParams {
  to: string; // Número de WhatsApp del usuario (formato internacional, e.g., +584249189050)
  body: string;
}

export class MessageService {
  private client: Twilio;

  constructor(accountSid: string, authToken: string) {
    this.client = twilio(accountSid, authToken);
  }

  async sendWhatsapp(params: WhatsappMessageParams): Promise<boolean> {
    const { to, body } = params;

    try {
      const message = await this.client.messages.create({
        body: body, // Cuerpo del mensaje que se envía
        from: "whatsapp:+14155238886", // Número de WhatsApp de Twilio
        to: `whatsapp:${to}`, // Número de destino en formato internacional
      });

      //console.log(`Message: ${to} ${body}`);
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    }
  }

  async sendWhatsappMessage(params: WhatsappMessageParams) {
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
