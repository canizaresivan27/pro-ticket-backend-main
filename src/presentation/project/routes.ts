import { Router } from "express";
import { ProjectController } from "./controller";

export class ProjectRoutes {
  static get routes(): Router {
    const router = Router();

    const controller = new ProjectController();

    router.get("/", controller.getProject);
    router.post("/", controller.createProject);
    router.put("/", controller.updateProject);
    router.delete("/", controller.deleteProject);

    return router;
  }
}
