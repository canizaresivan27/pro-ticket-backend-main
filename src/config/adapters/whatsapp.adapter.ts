import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

export const whatsapp = new Client({
  authStrategy: new LocalAuth(),
});

whatsapp.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

whatsapp.on("ready", () => {
  console.log("Client is ready!");
});
