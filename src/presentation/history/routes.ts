import { Router } from "express";
import { HistoryController } from "./controller";
import { HistoryServices } from "../services";

export class HistoryRoutes {
  static get routes(): Router {
    const router = Router();
    const historyServices = new HistoryServices();
    const controller = new HistoryController(historyServices);

    router.get("/", controller.getHistory);
    router.get("/id", controller.getHistoryById);
    router.post("/", controller.createHistory);
    router.put("/", controller.updateHistory);
    router.delete("/", controller.deleteHistory);

    return router;
  }
}
