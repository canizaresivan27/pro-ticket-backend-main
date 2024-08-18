import { Router } from "express";
import { ProjectController } from "./controller";
import { ProjectServices } from "../services";

export class ProjectRoutes {
  static get routes(): Router {
    const router = Router();
    const projectServices = new ProjectServices();
    const controller = new ProjectController(projectServices);

    router.get("/", controller.getProject);
    router.get("/:id", controller.getProjectById);
    router.get("/:id/tickets", controller.getRelatedTickets);
    router.post("/", controller.createProject);
    router.put("/", controller.updateProject);
    router.delete("/", controller.deleteProject);

    return router;
  }
}
