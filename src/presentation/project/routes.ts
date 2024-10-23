import { Router } from "express";
import { ProjectController } from "./controller";
import { ProjectServices } from "../services";
import { upload } from "../middlewares/multer.middleware";

export class ProjectRoutes {
  static get routes(): Router {
    const router = Router();
    const projectServices = new ProjectServices();
    const controller = new ProjectController(projectServices);

    router.get("/ws", controller.getWhatsappStatus);
    router.post("/disconnet-ws", controller.disconnectWhatsappSession);

    router.get("/", controller.getProject);
    router.get("/:id", controller.getProjectById);
    router.get("/status/:id", controller.getProjectStatus);
    router.get("/related/:id", controller.getRelatedProjects);
    router.get("/related/reseller/:id", controller.getRelatedProjectsReseller);
    router.get("/:id/tickets", controller.getRelatedTickets);
    router.post("/", upload.single("image"), controller.createProject);
    router.put("/", upload.single("image"), controller.updateProject);
    router.put("/members", controller.updateProjectMembers);
    router.delete("/", controller.deleteProject);

    return router;
  }
}
