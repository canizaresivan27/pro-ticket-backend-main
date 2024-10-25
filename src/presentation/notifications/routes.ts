import { Router } from "express";
import { NotificationServices } from "../services";
import { NotificationController } from "./controller";

export class NotificationRoutes {
  static get routes(): Router {
    const router = Router();
    const notificationServices = new NotificationServices();
    const controller = new NotificationController(notificationServices);

    router.get("/ws-status", controller.getStatusConnection);
    router.post("/ws-disconnect", controller.disconnectSession);

    return router;
  }
}
