import multer from "multer";

export class MulterAdapter {
  private upload;

  constructor() {
    // Configuración de multer (almacenar en memoria, útil para subir a servicios como Cloudinary)
    const storage = multer.memoryStorage();
    this.upload = multer({ storage }).single("image"); // Cambia 'image' por el nombre del campo que esperas en la solicitud
  }

  getMiddleware() {
    return this.upload;
  }
}
