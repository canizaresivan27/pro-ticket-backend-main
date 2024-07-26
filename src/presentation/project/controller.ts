import { Request, Response } from "express";
import { CreateProjectDto, CustomError } from "../../domain";

export class ProjectController {
  // DI
  constructor() {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.log(`${error}`);
    return res.status(500).json({ error: "Internal server error" });
  };

  createProject = async (req: Request, res: Response) => {
    const [error, createProjectDto] = CreateProjectDto.create(req.body);
    if (error) return res.status(400).json({ error });

    res.json(createProjectDto);
  };

  getProject = async (req: Request, res: Response) => {
    res.json("GetProject");
  };

  updateProject = async (req: Request, res: Response) => {
    res.json("Update Project");
  };

  deleteProject = async (req: Request, res: Response) => {
    res.json("Delete Project");
  };
}
