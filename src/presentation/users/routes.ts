import { Router } from "express";
import { UserController } from "./controller";
import { UserServices } from "../services";

export class UserRoutes {
  static get routes(): Router {
    const router = Router();
    const userServices = new UserServices();
    const controller = new UserController(userServices);

    router.get("/", controller.getUser);
    router.get("/id", controller.userById);
    router.post("/", controller.createUser);
    router.put("/", controller.updateUser);
    router.delete("/", controller.deleteUser);

    return router;
  }
}
