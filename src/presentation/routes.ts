import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { ProjectRoutes } from "./project/routes";
import { AuthMiddleware } from "./middlewares/auth.middleware";
import { TicketRoutes } from "./tickets/routes";
import { HistoryRoutes } from "./history/routes";
import { UserRoutes } from "./users/routes";
import { PublicRoutes } from "./public/routes";
import { NotificationRoutes } from "./notifications/routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Definir las rutas
    router.use("/api/auth", AuthRoutes.routes);
    router.use("/api/public", PublicRoutes.routes);
    router.use("/api/users", [AuthMiddleware.validateJWT], UserRoutes.routes);
    router.use(
      "/api/projects",
      [AuthMiddleware.validateJWT],
      ProjectRoutes.routes
    );
    router.use(
      "/api/tickets",
      [AuthMiddleware.validateJWT],
      TicketRoutes.routes
    );
    router.use(
      "/api/history",
      [AuthMiddleware.validateJWT],
      HistoryRoutes.routes
    );
    router.use(
      "/api/notificacions",
      [AuthMiddleware.validateJWT],
      NotificationRoutes.routes
    );

    return router;
  }
}
