import { Router } from "express";
import { TicketController } from "./controller";
import { MessageService, TicketServices } from "../services";

export class TicketRoutes {
  static get routes(): Router {
    const router = Router();
    const messageService = new MessageService();
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
