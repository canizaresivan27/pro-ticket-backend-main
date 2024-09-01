import { Router } from "express";
import { AuthController } from "./controller";
import { AuthServices, EmailService } from "../services";
import { envs } from "../../config";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const emailServices = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY
    );

    const authServices = new AuthServices(emailServices);

    const controller = new AuthController(authServices);

    router.post("/login", controller.loginUser);
    //router.post("/register", controller.registerUser);
    router.get("/validate-email/:token", controller.validateEmail);

    return router;
  }
}
