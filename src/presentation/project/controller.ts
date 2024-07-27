import { Request, Response } from "express";
import {
  CreateProjectDto,
  CustomError,
  GetProjectByIdDto,
  PaginationDto,
} from "../../domain";
import { ProjectServices } from "../services";

export class ProjectController {
  // DI
  constructor(private readonly projectServices: ProjectServices) {}

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

    this.projectServices
      .createProject(createProjectDto!, req.body.user)
      .then((project) => res.status(201).json(project))
      .catch((error) => this.handleError(error, res));
  };

  getProject = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });

    this.projectServices
      .getProjects(paginationDto!)
      .then((projects) => res.status(201).json(projects))
      .catch((error) => this.handleError(error, res));
  };

  projectById = async (req: Request, res: Response) => {
    const [error, getProjectByIdDto] = GetProjectByIdDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.projectServices
      .getProjectById(getProjectByIdDto!)
      .then((project) => res.status(201).json(project))
      .catch((error) => this.handleError(error, res));
  };

  updateProject = async (req: Request, res: Response) => {
    res.json("Update Project");
  };

  deleteProject = async (req: Request, res: Response) => {
    res.json("Delete Project");
  };
}
