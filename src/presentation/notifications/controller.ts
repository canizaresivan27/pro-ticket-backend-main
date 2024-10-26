import { Request, Response } from "express";
import { CreateProjectDto, CustomError } from "../../domain";
import { NotificationServices } from "../services";

export class NotificationController {
  // DI
  constructor(private readonly notificationServices: NotificationServices) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: "Internal server error" });
  };

  getStatusConnection = async (req: Request, res: Response) => {
    //const [error, createProjectDto] = CreateProjectDto.create(projectData);
    //if (error) return res.status(400).json({ error });

    this.notificationServices
      .getStatus()
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };

  disconnectSession = async (req: Request, res: Response) => {
    //const [error, createProjectDto] = CreateProjectDto.create(projectData);
    //if (error) return res.status(400).json({ error });

    this.notificationServices
      .disconnectSession()
      .then((data) => res.status(201).json(data))
      .catch((error) => this.handleError(error, res));
  };
}
