import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { ProjectRoutes } from "./project/routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Definir las rutas
    router.use("/api/auth", AuthRoutes.routes);
    router.use("/api/projects", ProjectRoutes.routes);

    return router;
  }
}
