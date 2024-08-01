import { envs } from "../envs";
let QRCode = require("qrcode");

//const QR_SEED = envs.QR_SEED;

export class QRAdapter {
  static async generateQrCode(payload: any, duration: string = "24h") {
    try {
      const payloadString = JSON.stringify(payload);

      const qrCodeUrl = await QRCode.toDataURL(payloadString);

      return qrCodeUrl;
    } catch (error) {
      console.error("Error generando el código QR:", error);
      return null;
    }
  }
}
