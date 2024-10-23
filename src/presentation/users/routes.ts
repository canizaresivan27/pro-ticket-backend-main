import { Router } from "express";
import { UserController } from "./controller";
import { UserServices } from "../services";
import { upload } from "../middlewares/multer.middleware";

export class UserRoutes {
  static get routes(): Router {
    const router = Router();
    const userServices = new UserServices();
    const controller = new UserController(userServices);

    router.get("/", controller.getUser);
    router.get("/:id", controller.userById);
    router.get("/related/:id", controller.getRelatedUsers);
    router.post("/", upload.single("image"), controller.createUser);
    router.post("/reseller", upload.single("image"), controller.createReseller);
    router.put("/", upload.single("image"), controller.updateUser);
    router.delete("/", controller.deleteUser);
    router.delete("/reseller", controller.deleteReseller);

    return router;
  }
}
