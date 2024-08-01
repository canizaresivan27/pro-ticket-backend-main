import { Router } from "express";
import { TicketController } from "./controller";
import { TicketServices } from "../services";

export class TicketRoutes {
  static get routes(): Router {
    const router = Router();
    const ticketServices = new TicketServices();
    const controller = new TicketController(ticketServices);

    router.get("/", controller.getTicket);
    router.get("/id", controller.ticketById);
    router.post("/", controller.createTicket);
    router.put("/", controller.updateTicket);
    router.delete("/", controller.deleteTicket);

    return router;
  }
}
