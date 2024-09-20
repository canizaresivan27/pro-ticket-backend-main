import { Router } from "express";
import { PublicController } from "./controller";
import { SearchServices } from "../services";
import { envs } from "../../config";

export class PublicRoutes {
  static get routes(): Router {
    const router = Router();

    const searchServices = new SearchServices();
    const controller = new PublicController(searchServices);

    router.get("/ticket/:id", controller.ticketById);
    return router;
  }
}
