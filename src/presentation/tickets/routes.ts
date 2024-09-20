import { Router } from "express";
import { TicketController } from "./controller";
import { MessageService, TicketServices } from "../services";
import { envs } from "../../config";

export class TicketRoutes {
  static get routes(): Router {
    const router = Router();
    const messageService = new MessageService(
      envs.TWILIO_ACCOUNT_SID,
      envs.TWILIO_AUTH_TOKEN
    );
    const ticketServices = new TicketServices(messageService);
    const controller = new TicketController(ticketServices);

    router.get("/list/:id", controller.getTicket);
    router.get("/:id", controller.ticketById);
    router.post("/", controller.createTicket);
    router.post("/message", controller.sendMessage);
    router.put("/", controller.updateTicket);
    router.delete("/", controller.deleteTicket);

    return router;
  }
}
